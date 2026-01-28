// Algoritma Boyer-Moore String Matching
class BoyerMooreAlgorithm {
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

  // Membangun Tabel Bad Character
  buildBadCharTable(pattern) {
    const table = {};
    const m = pattern.length;

    for (let i = 0; i < m - 1; i++) {
      table[pattern[i]] = i;
    }

    return table;
  }

  // Algoritma Boyer-Moore - Kompleksitas Terbaik O(n/m), Terburuk O(n * m)
  search(text, pattern) {
    this.resetComparisons();
    const positions = [];
    const n = text.length;
    const m = pattern.length;

    if (m === 0 || n === 0 || m > n) return positions;

    const textLower = text.toLowerCase();
    const patternLower = pattern.toLowerCase();

    const badChar = this.buildBadCharTable(patternLower);

    let shift = 0;

    while (shift <= n - m) {
      let j = m - 1;

      while (j >= 0) {
        this.comparisons++;
        if (patternLower[j] !== textLower[shift + j]) {
          break;
        }
        j--;
      }

      if (j < 0) {
        positions.push(shift);
        shift += shift + m < n ? m - (badChar[textLower[shift + m]] ?? -1) : 1;
      } else {
        const badCharShift = badChar[textLower[shift + j]] ?? -1;
        shift += Math.max(1, j - badCharShift);
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
