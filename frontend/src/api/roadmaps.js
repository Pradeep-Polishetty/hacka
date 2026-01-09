export const roadmapApi = {
  async generate(userData) {
    const res = await fetch('/api/roadmaps/generate', {  // ← Proxy /api → backend
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    // console.log('Response from generate:', res);
    if (!res.ok) {
      const error = await res.text();
      throw new Error(`Generation failed: ${error}`);
    }
    return res.json();
  },

  async get(id) {
    console.log("Gbggg")
    const res = await fetch(`/api/roadmaps/${id}`);
    if (!res.ok) {
      const error = await res.text();
      throw new Error(`Roadmap not found: ${error}`);
    }
    return res.json();
  },

  async update( id,log) {
    console.log("Gngg-11",log)
    console.log("data sent--",JSON.stringify(log))
    const res = await fetch(`/api/roadmaps/${id}/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(log)
    });
    if (!res.ok) {
      const error = await res.text();
      throw new Error(`Update failed: ${error}`);
    }
    return res.json();
  }
};
