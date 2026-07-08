'use client';

/**
 * Service for interacting with Study Materials in MongoDB via Next.js API routes.
 */
class MaterialService {
  /**
   * Initiates a material upload.
   */
  async uploadMaterial(material: any) {
    const res = await fetch('/api/materials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(material),
    });
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || 'Failed to upload material');
    }
    return await res.json();
  }

  /**
   * Gets a single material by ID.
   */
  async getMaterial(id: string) {
    const res = await fetch(`/api/materials/${id}`);
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || 'Failed to fetch material');
    }
    const data = await res.json();
    return data.data;
  }

  /**
   * Updates an existing material (Admin/Owner action).
   */
  async updateMaterial(id: string, data: any) {
    const res = await fetch(`/api/materials/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || 'Failed to update material');
    }
    return await res.json();
  }

  /**
   * Deletes a material (Admin/Owner action).
   */
  async deleteMaterial(id: string) {
    const res = await fetch(`/api/materials/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || 'Failed to delete material');
    }
    return await res.json();
  }

  /**
   * Increments download count.
   */
  async incrementDownloadCount(id: string) {
    try {
      await fetch(`/api/materials/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ incrementDownloads: true }),
      });
    } catch (e) {
      console.error('Failed to increment download count', e);
    }
  }

  /**
   * Increments view count.
   */
  async incrementViewCount(id: string) {
    try {
      await fetch(`/api/materials/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ incrementViews: true }),
      });
    } catch (e) {
      console.error('Failed to increment view count', e);
    }
  }
}

export const materialService = new MaterialService();
