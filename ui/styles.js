module.exports = `
.mob #input-area {
  position: absolute;
  height: 40px;
  min-height: 40px;
}
.mob.with-header-regular.with-footer main {
  height: calc(100% - 85px);
}
#input {
  resize: none;
}/*
#header {
  -webkit-app-region: drag;
}
#header .variant {
  padding-left: 75px;
  box-sizing: border-box;
}*/
#header button {
  cursor: pointer;
}

.ai-deleted .openMS {
  display: none;
}
`.trim()

/* button colors
green
bg 16% 79% 25%
border 18% 68% 19%
border disabled 82% x3
disabled 87% x3

red bg 100% 38% 34%
*/
