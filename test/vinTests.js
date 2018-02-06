'use strict';
/******************************************************************************
 * MIT License
 * Copyright (c) 2017 https://github.com/vroomlabs
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the 'Software'), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:

 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.

 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 * Created by vroomlabs on 9/13/17.
 ******************************************************************************/

var should = require('should');
var vinCheck = require('../index').vinValidate;


describe('Vin Validate', function () {

    it('should return true for an old padded-vin', function () {
        var errors = [];
        should.equal(vinCheck('00042512110000705', 1977, errors), true, 'Errors: ' + errors.join(' '));
    });

    it('should return true for an old short-vin', function () {
        var errors = [];
        should.equal(vinCheck('9111121907', 1977, errors), true, 'Errors: ' + errors.join(' '));
    });

    it('should return true for an old vin', function () {
        var errors = [];
        should.equal(vinCheck('1G5EC13D5B7100001', 1981, errors), true, 'Errors: ' + errors.join(' '));
    });

    it('should return true for a newer EU vin with bad checkdigit', function () {
        var errors = [];
        should.equal(vinCheck('ZACCJABT0FPB66932', 2015, errors), true, 'Errors: ' + errors.join(' '));
    });

    it('should return true for a valid vin', function () {
        var errors = [];
        should.equal(vinCheck('WDDUG8CB9FA092680', 2015, errors), true, 'Errors: ' + errors.join(' '));
    });

    it('should return true without a year provided', function () {
        var errors = [];
        should.equal(vinCheck('ZACCJABT0FPB66932'), true, 'Errors: ' + errors.join(' '));
    });

    it('should return false for the wrong year', function () {
        var errors = [];
        should.equal(vinCheck('ZACCJABT0FPB66932', 2014, errors), false, 'Expected an error.');
        should.equal(errors[0], 'VIN year is incorrect.');
    });

    it('should return false for the wrong digits', function () {
        var errors = [];
        should.equal(vinCheck('3FA6P0PU0ER395281', 2014, errors), false, 'Expected an error.');
        should.equal(errors[0], 'VIN check digit does not match (6 !== 0).');
    });

    it('should return false for null VIN', function () {
        var errors = [];
        should.equal(vinCheck(null, 0, errors), false, 'Expected an error.');
        should.equal(errors[0], 'VIN is not a string.');
    });

    it('should return false for numeric VIN', function () {
        var errors = [];
        should.equal(vinCheck(9111121907, 0, errors), false, 'Expected an error.');
        should.equal(errors[0], 'VIN is not a string.');
    });

    it('should return false for invalid VIN pattern', function () {
        var errors = [];
        should.equal(vinCheck('3FI6P0PU0ER395281', 2014, errors), false, 'Expected an error.');
        should.equal(errors[0], 'VIN fails pattern check.');
    });

    it('should not blow up on short vins', function () {
        var errors = [];
        should.equal(vinCheck('SU', 2014, errors), false, 'Expected an error.');
        should.equal(errors[0], 'VIN fails pattern check.');
    });
});
