"use strict";

var _refs = _interopRequireDefault(require("./refs.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
console.clear();
_refs.default.formEl.addEventListener('submit', e => {
  e.preventDefault();
  _refs.default.formEl.reset();
});
_refs.default.loginBtn.addEventListener('click', () => {
  window.open('/auth/twitch');
});