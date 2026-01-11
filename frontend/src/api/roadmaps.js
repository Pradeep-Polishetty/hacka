export const roadmapApi = {
  // ✅ Generate roadmap
  async generate(formData = {}) {
    const payload = {
      year:
        typeof formData.year === 'string'
          ? parseInt(formData.year)
          : formData.year || new Date().getFullYear(),

      skills: typeof formData.skills === 'string'
        ? formData.skills.split(',').map(s => s.trim()).filter(Boolean)
        : [],

      companies: typeof formData.companies === 'string'
        ? formData.companies.split(',').map(c => c.trim()).filter(Boolean)
        : []
    };

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/roadmaps/generate`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }
    );

    if (!res.ok) {
      const error = await res.text();
      throw new Error(error);
    }

    return res.json();
  },

  // ✅ Get roadmap by ID (FIXES YOUR ERROR)
  async get(id) {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/roadmaps/${id}`
    );

    if (!res.ok) {
      const error = await res.text();
      throw new Error(error);
    }

    return res.json();
  },

  // ✅ Update progress
  async update(id, log) {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/roadmaps/${id}/update`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(log)
      }
    );

    if (!res.ok) {
      const error = await res.text();
      throw new Error(error);
    }

    return res.json();
  }
};
