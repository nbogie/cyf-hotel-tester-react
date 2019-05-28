class API {
  constructor(host) {
    this.host = host;
  }

  resolve = path => this.host + path;

  setEndpoint = url => {
    console.log(`API endpoint now ${url}`);
    this.host = url;
  };
  create = (resource, msg) =>
    fetch(this.resolve(`/${resource}`), {
      method: "POST",
      body: JSON.stringify(msg),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(res => res);

  delete = id =>
    fetch(this.resolve(`/${resource}/${id}`), {
      method: "DELETE"
    }).then(res => res);

  getAll = () => fetch(this.resolve(`/${resource}`)).then(res => res.json());

  getOne = id =>
    fetch(this.resolve(`/${resource}/${id}`)).then(res => res.json());
}

export default API;
