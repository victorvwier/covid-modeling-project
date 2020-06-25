/*
Licensed to the Apache Software Foundation (ASF) under one
or more contributor license agreements.  See the NOTICE file
distributed with this work for additional information
regarding copyright ownership.  The ASF licenses this file
to you under the Apache License, Version 2.0 (the
"License"); you may not use this file except in compliance
with the License.  You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed on an
"AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, either express or implied.  See the License for the
specific language governing permissions and limitations
under the License.
*/

import JsPdf from 'jspdf';

/** @class PdfDownloadService describing a class to let us downloads pdfs. */
export default class PdfDownloadService {
  /**
   * A function to create a pdf to download.
   *
   * @static
   * @param {Object} data An object containing the data to be downloaded.
   */
  static createDownloadPdf(data) {
    const html = this._createHTML(data);
    const sirCanvas = document.getElementById('chart-canvas');
    this._turnToWhiteBackground(sirCanvas);
    const sirChart = sirCanvas.toDataURL('image/jpeg');

    const demographicCanvas = document.getElementById('demographics');
    this._turnToWhiteBackground(demographicCanvas);
    const demographicChart = demographicCanvas.toDataURL('image/jpeg');

    const doc = new JsPdf();

    doc.addImage(sirChart, 'JPEG', 10, 10, 170, 100);

    doc.addImage(demographicChart, 'JPEG', 10, 120, 170, 100);

    doc.fromHTML(html, 10, 300);
    doc.save();
  }

  static _turnToWhiteBackground(canvas) {
    const ctx = canvas.getContext('2d');

    // change non-opaque pixels to white
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] < 255) {
        data[i] = 255 - data[i];
        data[i + 1] = 255 - data[i + 1];
        data[i + 2] = 255 - data[i + 2];
        data[i + 3] = 255 - data[i + 3];
      }
    }
    ctx.putImageData(imgData, 0, 0);
  }

  /**
   * A function to retrieve the Demographics chart as an image.
   *
   * @static
   * @returns {Object} An object representing the image.
   */
  static _getDemographicChartImg() {
    const canvas = document.getElementById('demographics');
    const img = canvas.toDataURL('image/jpeg');
    return img;
  }

  /**
   * A function to create a piece of HTML that can display the stats.
   *
   * @static
   * @param {Object} data An object containing all the data for the pdf.
   * @returns {String} A string containing HTML representing all the raw data per day.
   */
  static _createHTML(data) {
    return `
    <main>
      <h1>Data</h1>
      <ul>
      ${Object.keys(data).map(
        (day) => `
        <li>
          <span>Day ${day}</span>
          <ul>
            <li>susceptible: ${data[day].susceptible}</li>
            <li>infectious: ${data[day].infectious}</li>
            <li>noninfectious: ${data[day].noninfectious}</li>
            <li>immune: ${data[day].immune}</li>
            <li>dead: ${data[day].dead}</li>
          </ul>
        </li>
      
      `
      )}
      </ul>
    </main>

    
    `;
  }
}
