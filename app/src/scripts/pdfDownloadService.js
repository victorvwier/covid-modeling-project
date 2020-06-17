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
    const sirChart = sirCanvas.toDataURL('image/jpeg');

    const demographicCanvas = document.getElementById('demographics');
    const demographicChart = demographicCanvas.toDataURL('image/jpeg');

    const doc = new JsPdf();

    doc.addImage(sirChart, 'JPEG', 10, 10, 170, 100);

    doc.addImage(demographicChart, 'JPEG', 10, 120, 170, 100);

    doc.fromHTML(html, 10, 300);
    doc.save();
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
