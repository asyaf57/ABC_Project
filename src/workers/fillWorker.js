// fillWorker.js
// Web Worker for processing Flood Fill algorithm off the main thread

self.onmessage = function(e) {
  const { imgData, W, H, sx, sy, colorHex } = e.data;
  
  const ix = Math.floor(sx);
  const iy = Math.floor(sy);
  
  if (ix < 0 || ix >= W || iy < 0 || iy >= H) {
    self.postMessage({ error: 'Out of bounds' });
    return;
  }

  const d = imgData.data;
  const sp = (iy * W + ix) * 4;
  const sr = d[sp];
  const sg = d[sp + 1];
  const sb = d[sp + 2];
  
  // Block on dark strokes (outline/borders)
  if (sr < 60 && sg < 60 && sb < 60) {
    self.postMessage({ imgData });
    return;
  }

  // Parse target color hex
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(colorHex);
  if (!m) {
    self.postMessage({ error: 'Invalid color' });
    return;
  }
  const fr = parseInt(m[1], 16);
  const fg = parseInt(m[2], 16);
  const fb = parseInt(m[3], 16);

  // If clicked color is already very close to target color, don't fill
  if (Math.abs(sr - fr) < 5 && Math.abs(sg - fg) < 5 && Math.abs(sb - fb) < 5) {
    self.postMessage({ imgData });
    return;
  }

  const TOL = 80;

  // Optimized match function
  function match(p) {
    // Stop at dark borders (anti-aliasing boundary)
    if (d[p] < 60 && d[p+1] < 60 && d[p+2] < 60) return false;
    // Check tolerance
    return Math.abs(d[p] - sr) <= TOL && 
           Math.abs(d[p+1] - sg) <= TOL && 
           Math.abs(d[p+2] - sb) <= TOL;
  }

  // Linear span fill algorithm (scanline) using a 1D flat array for the stack
  // This avoids memory overhead of pushing/popping objects or 2D arrays
  const stack = new Int32Array(W * H * 2); // max possible size
  let stackPtr = 0;
  
  // Push initial coordinates
  stack[stackPtr++] = ix;
  stack[stackPtr++] = iy;

  while (stackPtr > 0) {
    const y = stack[--stackPtr];
    const x = stack[--stackPtr];
    
    let py = y;
    let pp = (py * W + x) * 4;
    
    // Move up to find the top boundary
    while (py >= 0 && match(pp)) {
      py--;
      pp -= W * 4;
    }
    
    pp += W * 4;
    py++;
    
    let spanLeft = false;
    let spanRight = false;
    
    // Scan downwards
    while (py < H && match(pp)) {
      // Color pixel
      d[pp] = fr;
      d[pp+1] = fg;
      d[pp+2] = fb;
      d[pp+3] = 255;
      
      // Check left
      if (x > 0) {
        if (match(pp - 4)) {
          if (!spanLeft) {
            stack[stackPtr++] = x - 1;
            stack[stackPtr++] = py;
            spanLeft = true;
          }
        } else if (spanLeft) {
          spanLeft = false;
        }
      }
      
      // Check right
      if (x < W - 1) {
        if (match(pp + 4)) {
          if (!spanRight) {
            stack[stackPtr++] = x + 1;
            stack[stackPtr++] = py;
            spanRight = true;
          }
        } else if (spanRight) {
          spanRight = false;
        }
      }
      
      pp += W * 4;
      py++;
    }
  }

  // Return the modified pixel array back to main thread
  self.postMessage({ imgData });
};
