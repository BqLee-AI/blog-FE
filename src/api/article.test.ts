import { beforeEach, describe, expect, it, vi } from 'vitest';
import apiClient from './apiClient';
import { articleApi } from './article';

vi.mock('./apiClient', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

const mockedApiClient = apiClient as unknown as {
  get: ReturnType<typeof vi.fn>;
  post: ReturnType<typeof vi.fn>;
  put: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
};

beforeEach(() => {
  mockedApiClient.get.mockReset();
  mockedApiClient.post.mockReset();
  mockedApiClient.put.mockReset();
  mockedApiClient.delete.mockReset();
});

describe('article api adapter', () => {
  it('creates article from backend envelope response', async () => {
    mockedApiClient.post.mockResolvedValueOnce({
      data: {
        data: {
          id: 42,
          title: 'Hello World',
          summary: 'First article',
          cover_image: '',
          content: '<p>content</p>',
          author: {
            id: 7,
            username: 'Alice',
          },
          tags: [],
          category: null,
          view_count: 0,
          created_at: '2026-04-13T08:00:00Z',
          updated_at: '2026-04-13T08:00:00Z',
        },
      },
    });

    await expect(
      articleApi.create({
        title: 'Hello World',
        content: '<p>content</p>',
        summary: 'First article',
      })
    ).resolves.toEqual({
      id: 42,
      title: 'Hello World',
      summary: 'First article',
      cover_image: '',
      author: {
        id: 7,
        username: 'Alice',
      },
      view_count: 0,
      created_at: '2026-04-13T08:00:00Z',
      updated_at: '2026-04-13T08:00:00Z',
      content: '<p>content</p>',
      tags: [],
      category: null,
    });

    expect(mockedApiClient.post).toHaveBeenCalledWith(
      '/articles',
      {
        title: 'Hello World',
        content: '<p>content</p>',
        summary: 'First article',
      },
      { signal: undefined }
    );
  });

  it('updates article with the expected endpoint and payload', async () => {
    mockedApiClient.put.mockResolvedValueOnce({
      data: {
        message: 'Article updated successfully',
      },
    });

    await expect(
      articleApi.update(42, {
        title: 'Updated title',
        status: 'published',
      })
    ).resolves.toBeUndefined();

    expect(mockedApiClient.put).toHaveBeenCalledWith(
      '/articles/42',
      {
        title: 'Updated title',
        status: 'published',
      },
      { signal: undefined }
    );
  });

  it('deletes article through the expected endpoint', async () => {
    mockedApiClient.delete.mockResolvedValueOnce({
      data: {
        message: 'Article deleted successfully',
      },
    });

    await expect(articleApi.delete(42)).resolves.toBeUndefined();

    expect(mockedApiClient.delete).toHaveBeenCalledWith('/articles/42', { signal: undefined });
  });
});