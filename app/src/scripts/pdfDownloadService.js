import JsPdf from 'jspdf';

export default class PdfDownloadService {
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

  static _getDemographicChartImg() {
    const canvas = document.getElementById('demographics');
    const img = canvas.toDataURL('image/jpeg');
    return img;
  }

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
