import JsPdf from 'jspdf';

export default class PdfDownloadService {
  static createDownloadPdf(data) {
    const html = this._createHTML(data);
    const doc = new JsPdf();
    doc.fromHTML(html, 10, 10);
    doc.save();
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
