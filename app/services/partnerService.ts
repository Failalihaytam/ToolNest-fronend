import api from './api';

export async function signaleePartner(partnerId: number) {
  return api.post(`/partners/${partnerId}/signalee`);
}