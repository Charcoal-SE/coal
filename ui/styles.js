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
}
/* buttons */
#header button {
  cursor: pointer;
}
`.trim()
