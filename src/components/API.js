class API {
  constructor(host) {
    this.host = host;
  }

  resolve = path => this.host + path;

  setEndpoint = url => {
    console.log(`API endpoint now ${url}`);
    this.host = url;
  };
  create = (resource, msg) => {
    console.log(`POSTing ${resource}:`, msg);
    return fetch(this.resolve(`/${resource}`), {
      method: "POST",
      body: JSON.stringify(msg),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(res => res);
  };

  update = (resource, id, msg) =>
    fetch(this.resolve(`/${resource}/${id}`), {
      method: "PUT",
      body: JSON.stringify(msg),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(res => res);

  delete = (resource, id) =>
    fetch(this.resolve(`/${resource}/${id}`), {
      method: "DELETE"
    }).then(res => res);

  getAll = resource =>
    fetch(this.resolve(`/${resource}`)).then(res => res.json());

  getOne = (resource, id) =>
    fetch(this.resolve(`/${resource}/${id}`)).then(res => res.json());
}

export default API;
