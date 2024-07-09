import { Injectable } from '@angular/core';
import CryptoJS from 'crypto-js';

import {GlobalService} from './Global.service'
import { Response } from '../Models/Response';


@Injectable({
  providedIn: 'root',
})
export class EncryptionService {

  constructor(
    public GlobalService : GlobalService
) {}

  public key = this.GlobalService.key; // Replace with your key
  public iv = this.GlobalService.iv;     // Replace with your IV

  encrypt(plaintext: string): string {
    const key = CryptoJS.enc.Utf8.parse(this.key);
    const iv = CryptoJS.enc.Utf8.parse(this.iv);

    // Encrypt using AES/CBC/NoPadding
    const encrypted = CryptoJS.AES.encrypt(plaintext, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      //padding: CryptoJS.pad.NoPadding,
    });

    return encrypted.toString();
  }

  decryptToJson(encryptedText: string): any[] {
    const key = CryptoJS.enc.Utf8.parse(this.key);
    const iv = CryptoJS.enc.Utf8.parse(this.iv);

    const decrypted = CryptoJS.AES.decrypt(encryptedText, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.NoPadding,
    });

    const decryptedText = decrypted.toString(CryptoJS.enc.Utf8).replace(/\0+$/g, '');
    return JSON.parse(decryptedText);
  }

  decrypt(cipherText: string): string {
    const key = CryptoJS.enc.Utf8.parse(this.key);
    const iv = CryptoJS.enc.Utf8.parse(this.iv);

    const decrypted = CryptoJS.AES.decrypt(cipherText, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.NoPadding,
    });

    const decryptedText = decrypted.toString(CryptoJS.enc.Utf8).replace(/\0+$/g, '');
    return decryptedText;
  }

  // decryptResponse(response: Response): Response {
  //   if (response.data && typeof response.data === 'string') {
  //     const decryptedData = this.decryptToJson(response.data);
  //     return { ...response, data: decryptedData };
  //   } else {
  //     // Handle the case where response.data is not an array
  //     console.error('Data is not an array:', response.data);
  //     return response;
  //   }
  // }

  decryptResponse(response: Response): Response {
    if (response.data && typeof response.data === 'string') {
      return { ...response};
    } else {
      // Handle the case where response.data is not an array
      console.error('Data is not an array:', response.data);
      return response;
    }
  }


}