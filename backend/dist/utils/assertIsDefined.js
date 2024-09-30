"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertIsDefined = assertIsDefined;
function assertIsDefined(val) {
    if (val === null || val === undefined) {
        throw new Error(`Expected 'val' to be defined, but received ${val}`);
    }
}
