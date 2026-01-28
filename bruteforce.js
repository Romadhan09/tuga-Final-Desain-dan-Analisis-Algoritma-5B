// Algoritma Brute Force String Matching
class BruteForceAlgorithm {
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

  // Algoritma Brute Force - Kompleksitas O(n * m)
  search(text, pattern) {
    this.resetComparisons();
    const positions = [];
    const n = text.length;
    const m = pattern.length;

    if (m === 0 || n === 0 || m > n) return positions;

    const textLower = text.toLowerCase();
    const patternLower = pattern.toLowerCase();

    for (let i = 0; i <= n - m; i++) {
      let j = 0;

      while (j < m) {
        this.comparisons++;
        if (textLower[i + j] !== patternLower[j]) {
          break;
        }
        j++;
      }

      if (j === m) {
        positions.push(i);
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
