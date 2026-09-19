export default class Alert {
  constructor(path = "/json/alerts.json") {
    // the path is passed in so the class can be reused with another alert file
    this.path = path;
  }

  async init() {
    const alerts = await this.getAlerts();
    // nothing to announce, so leave the page alone
    if (!alerts.length) return;

    const section = document.createElement("section");
    section.classList.add("alert-list");

    alerts.forEach((alert) => {
      const paragraph = document.createElement("p");
      paragraph.textContent = alert.message;
      paragraph.style.backgroundColor = alert.background;
      paragraph.style.color = alert.color;
      section.appendChild(paragraph);
    });

    const main = document.querySelector("main");
    main.prepend(section);
  }

  async getAlerts() {
    const response = await fetch(this.path);
    if (!response.ok) return [];
    return await response.json();
  }
}
