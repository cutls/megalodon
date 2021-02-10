"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCancel = exports.RequestCanceledError = void 0;
var RequestCanceledError = (function (_super) {
    __extends(RequestCanceledError, _super);
    function RequestCanceledError(msg) {
        var _this = _super.call(this, msg) || this;
        _this.isCancel = true;
        Object.setPrototypeOf(_this, RequestCanceledError);
        return _this;
    }
    return RequestCanceledError;
}(Error));
exports.RequestCanceledError = RequestCanceledError;
exports.isCancel = function (value) {
    return value && value.isCancel;
};
