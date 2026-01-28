// Algoritma KMP (Knuth-Morris-Pratt) String Matching
class KMPAlgorithm {
  constructor() {
    this.comparisons = 0;
  }

  // Mereset penghitung perbandingan
  resetComparisons() {
    this.comparisons = 0;
  }

  // Mendapatkan jumlah perbandingan
  getComparisons() {
    return this.comparisons;
  }

  // Menghitung array LPS (Longest Proper Prefix which is also Suffix)
  computeLPSArray(pattern) {
    const m = pattern.length;
    const lps = new Array(m).fill(0);
    let len = 0;
    let i = 1;

    while (i < m) {
      if (pattern[i] === pattern[len]) {
        len++;
        lps[i] = len;
        i++;
      } else {
        if (len !== 0) {
          len = lps[len - 1];
        } else {
          lps[i] = 0;
          i++;
        }
      }
    }

    return lps;
  }

  // Algoritma KMP - Kompleksitas O(n + m)
  search(text, pattern) {
    this.resetComparisons();
    const positions = [];
    const n = text.length;
    const m = pattern.length;

    if (m === 0 || n === 0 || m > n) return positions;

    const textLower = text.toLowerCase();
    const patternLower = pattern.toLowerCase();

    const lps = this.computeLPSArray(patternLower);

    let i = 0;
    let j = 0;

    while (i < n) {
      this.comparisons++;

      if (patternLower[j] === textLower[i]) {
        i++;
        j++;
      }

      if (j === m) {
        positions.push(i - j);
        j = lps[j - 1];
      } else if (i < n && patternLower[j] !== textLower[i]) {
        if (j !== 0) {
          j = lps[j - 1];
        } else {
          i++;
        }
      }
    }

    return positions;
  }

  // Mengecek apakah pattern ada dalam teks
  match(text, pattern) {
    const positions = this.search(text, pattern);
    return positions.length > 0;
  }
}
