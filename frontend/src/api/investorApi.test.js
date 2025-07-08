import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {
  fetchInvestors,
  fetchInvestorCommitments,
  fetchInvestorSummary
} from './investorApi';

describe('investorApi', () => {
  let mockAxios;

  beforeEach(() => {
    mockAxios = new MockAdapter(axios);
  });

  afterEach(() => {
    mockAxios.restore();
  });

  describe('fetchInvestors', () => {
    it('should fetch investors successfully', async () => {
      const mockData = [{ id: 1, name: 'Investor A' }];
      mockAxios.onGet('http://localhost:8000/investors/').reply(200, mockData);

      const result = await fetchInvestors();
      expect(result).toEqual(mockData);
      expect(mockAxios.history.get.length).toBe(1);
    });

    it('should handle fetch investors error', async () => {
      mockAxios.onGet('http://localhost:8000/investors/').reply(500);

      await expect(fetchInvestors()).rejects.toThrow();
    });
  });

  describe('fetchInvestorCommitments', () => {
    it('should fetch commitments for investor successfully', async () => {
      const investorName = 'Test Investor';
      const mockData = [{ id: 1, amount: 1000000 }];
      mockAxios.onGet(`http://localhost:8000/investors/investor_name/${encodeURIComponent(investorName)}`)
        .reply(200, mockData);

      const result = await fetchInvestorCommitments(investorName);
      expect(result).toEqual(mockData);
      expect(mockAxios.history.get.length).toBe(1);
    });

    it('should handle investor not found', async () => {
      const investorName = 'Nonexistent Investor';
      mockAxios.onGet(`http://localhost:8000/investors/investor_name/${encodeURIComponent(investorName)}`)
        .reply(404);

      await expect(fetchInvestorCommitments(investorName)).rejects.toThrow();
    });

    it('should properly encode investor names', async () => {
      const investorName = 'Investor & Co';
      mockAxios.onGet(`http://localhost:8000/investors/investor_name/${encodeURIComponent(investorName)}`)
        .reply(200, []);

      await fetchInvestorCommitments(investorName);
      expect(mockAxios.history.get[0].url).toContain('Investor%20%26%20Co');
    });
  });

  describe('fetchInvestorSummary', () => {
    it('should fetch summary for investor successfully', async () => {
      const investorName = 'Test Investor';
      const mockData = { total: 5000000, breakdown: [] };
      mockAxios.onGet(`http://localhost:8000/investors/investor_name/${encodeURIComponent(investorName)}/summary`)
        .reply(200, mockData);

      const result = await fetchInvestorSummary(investorName);
      expect(result).toEqual(mockData);
    });

    it('should handle empty summary response', async () => {
      const investorName = 'New Investor';
      mockAxios.onGet(`http://localhost:8000/investors/investor_name/${encodeURIComponent(investorName)}/summary`)
        .reply(200, {});

      const result = await fetchInvestorSummary(investorName);
      expect(result).toEqual({});
    });
  });
});