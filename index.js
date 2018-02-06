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

var vinPattern = /^(([a-hj-mp-z0-9]{9}[a-hj-mp-rtv-z0-9][a-hj-mp-z0-9]\d{6}|[a-hj-z0-9]{5,11}\d{5})|([A-HJ-NPR-Z\d]{8}[\dX][A-HJ-NPR-Z\d]{8}))$/gi;
var vinNorthAmerica = /^[1-5]/;
var vinYearDigits = 'ABCDEFGHJKLMNPRSTVWXY123456789';

module.exports = {
    /**
     * The regular expression used to match valid VINs
     */
    vinPattern: vinPattern,
    vinNorthAmerica: vinNorthAmerica,
    vinYearDigits: vinYearDigits,

    /**
     * Extract the year from the vin, either the most recent or the year provided.
     * @param {String} vin - The input VIN
     * @param reportedYear - The year on record for the VIN
     * @returns {number} Returns the most recent VIN year, or the provided year if a match, or 0 if failed
     */
    yearFromVin: function yearFromVin(vin, reportedYear) {
        if (!vin || typeof vin !== 'string' || vin.length !== 17)
            return 0;

        var ordinal = vinYearDigits.indexOf(vin[9]);
        var nextYear = new Date().getFullYear() + 1;

        var year = 1980 + ordinal;
        while (year <= nextYear) {
            if (reportedYear && reportedYear === year) {
                return year;
            }
            if (year + 30 > nextYear) {
                return year;
            }
            year += 30;
        }
        return 0;
    },

    checkDigitFromVin: function checkDigitFromVin(vin) {
        var cleaned_vin = vin.toUpperCase();

        var map = {
            A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8,
            J: 1, K: 2, L: 3, M: 4, N: 5, P: 7, R: 9,
            S: 2, T: 3, U: 4, V: 5, W: 6, X: 7, Y: 8, Z: 9,
            1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 0: 0
        };
        var weights = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2];

        var products = 0;
        for (var i = 0; i < cleaned_vin.length; i++) {
            products += map[cleaned_vin[i]] * weights[i];
        }
        var checkDigit = products % 11;
        if (checkDigit === 10) checkDigit = 'X';

        return checkDigit.toString().toUpperCase();
    },

    /**
     * Returns true if this appears to be a valid vin identifier
     * @param {String} vin - the vin number of the vehicle
     * @param {Number} reportedYear - the year of the vehicle
     * @param {Array} [reasons] - output the issues with the vin
     * @return {boolean} - true if valid
     */
    vinValidate: function vinValidate(vin, reportedYear, reasons) {

        // The output errors array must be valid & empty.
        if (!Array.isArray(reasons) || reasons.length !== 0) {
            reasons = [];
        }

        // The vin must be a string, or we're done here.
        if (!vin || typeof vin !== 'string') {
            reasons.push('VIN is not a string.');
            return false;
        }

        // This pattern *should*
        if (!vin.match(vinPattern)) {
            reasons.push('VIN fails pattern check.');
            return false;
        }

        if (reportedYear && reportedYear >= 1995) {
            var vinCheckDigit = module.exports.checkDigitFromVin(vin);
            var vinActualDigit = vin[8].toUpperCase();

            if (vin.match(vinNorthAmerica) && vinCheckDigit !== vinActualDigit)
                reasons.push('VIN check digit does not match (' + vinCheckDigit + ' !== ' + vinActualDigit + ').');

            if (reportedYear && reportedYear !== module.exports.yearFromVin(vin, reportedYear))
                reasons.push('VIN year is incorrect.');
        }

        return reasons.length === 0;
    }
};
