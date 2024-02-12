
import crypto from 'crypto' // pinstripe-if-client: const crypto = window.crypto;

import { Class } from './class.js';
import { Singleton } from './singleton.js';

const HASH_CASH_TARGET = Math.pow(2, 32 - 20);

export const ProofOfWork = Class.extend().include({
    meta(){
        this.include(Singleton)
    },

    async generateProofOfWork(input, options = {}){
        const { difficulty = 1, steps = 1000, onProgress = () => {}, abortSignal = { aborted: false } } = options;
        const inputHash = await this.createSha1Hash(JSON.stringify(input));
        const salt = await this.createSha1Hash(Math.random());
        const timestamp = this.getUTCTimestamp();
        const target = this.calculateTarget(difficulty, steps);
        const solution = [];
        
        let counter = -1;
        for(let i = 1; i <= steps && !abortSignal.aborted; i++){
            while(!abortSignal.aborted){
                counter++;
                const hash = await this.createSha1Hash(`${difficulty}:${steps}:${inputHash}:${salt}:${timestamp}:${counter}`);
                const integers = this.hexToIntegers(hash);
                if(integers[0] <= target) break;
            }
            solution.push(counter);
            const progressPercentage = Math.floor(i * (100 / steps) * 100) / 100;
            onProgress(progressPercentage);
        }

        if(abortSignal.aborted) return;

        return JSON.stringify({
            salt,
            timestamp,
            solution,
        });
    },

    async verifyProofOfWork(input, proofOfWork, options = {}){
        const { difficulty = 1 } = options;
        const { salt, timestamp, solution } = JSON.parse(proofOfWork);
        const steps = solution.length;
        const inputHash = await this.createSha1Hash(JSON.stringify(input));
        const target = this.calculateTarget(difficulty, steps);
        for(let i = 0; i < steps; i++){
            const counter = solution[i];
            const hash = await this.createSha1Hash(`${difficulty}:${steps}:${inputHash}:${salt}:${timestamp}:${counter}`.toString(), true);
            const integers = this.hexToIntegers(hash);
            if(integers[0] > target) return false;
        }
        return true;
    },

    async createSha1Hash(input) {
        const buffer = new TextEncoder().encode(input);
        const hashArray = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-1', buffer)));
        return hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
    },
    
    hexToIntegers(hex){
        const out = [];
        for(let i = 0; i < hex.length; i += 8){
            out.push(parseInt(hex.slice(i, i + 8), 16));
        }
        return out;
    },
    
    calculateTarget(difficulty, steps){
        return (HASH_CASH_TARGET / difficulty) * steps;
    },
    
    getUTCTimestamp() {
        const now = new Date();
      
        const year = now.getUTCFullYear() % 100;
        const month = String(now.getUTCMonth() + 1).padStart(2, '0');
        const day = String(now.getUTCDate()).padStart(2, '0');
        const hours = String(now.getUTCHours()).padStart(2, '0');
        const minutes = String(now.getUTCMinutes()).padStart(2, '0');
        const seconds = String(now.getUTCSeconds()).padStart(2, '0');
      
        return `${year}${month}${day}${hours}${minutes}${seconds}`;
    }
});

export const generateProofOfWork = (...args) => ProofOfWork.instance.generateProofOfWork(...args);
  
export const verifyProofOfWork = (...args) => ProofOfWork.instance.verifyProofOfWork(...args);
