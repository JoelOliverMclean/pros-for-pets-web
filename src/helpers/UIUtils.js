const BREAKPOINTS = { xs: 0, sm: 576, md: 768, lg: 992, xl: 1200, xxl: 1400 };
const BREAKPOINT_ARR = Object.keys(BREAKPOINTS).map(function (k) {
  return k;
});

const isAtLeast = (targetBreakpoint, currentBreakpoint) => {
  let currentPos = BREAKPOINT_ARR.indexOf(currentBreakpoint);
  let targetPos = BREAKPOINT_ARR.indexOf(targetBreakpoint);
  return currentPos >= targetPos;
};

const isAtMost = (targetBreakpoint, currentBreakpoint) => {
  let currentPos = BREAKPOINT_ARR.indexOf(currentBreakpoint);
  let targetPos = BREAKPOINT_ARR.indexOf(targetBreakpoint);
  return currentPos <= targetPos;
};

export default { BREAKPOINTS, isAtLeast, isAtMost };
