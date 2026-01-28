// Kelas Utama String Matching - Menggabungkan semua algoritma
class StringMatchingAlgorithms {
  constructor() {
    this.comparisons = 0;
    this.bruteForceAlgo = new BruteForceAlgorithm();
    this.kmpAlgo = new KMPAlgorithm();
    this.boyerMooreAlgo = new BoyerMooreAlgorithm();
  }

  // Mereset penghitung perbandingan
  resetComparisons() {
    this.comparisons = 0;
  }

  // Mendapatkan jumlah perbandingan
  getComparisons() {
    return this.comparisons;
  }

  // Mencari menggunakan algoritma yang ditentukan
  search(text, pattern, algorithm = "kmp") {
    let positions;
    const startTime = performance.now();

    switch (algorithm.toLowerCase()) {
      case "kmp":
        positions = this.kmpAlgo.search(text, pattern);
        this.comparisons = this.kmpAlgo.getComparisons();
        break;
      case "boyermoore":
        positions = this.boyerMooreAlgo.search(text, pattern);
        this.comparisons = this.boyerMooreAlgo.getComparisons();
        break;
      case "bruteforce":
        positions = this.bruteForceAlgo.search(text, pattern);
        this.comparisons = this.bruteForceAlgo.getComparisons();
        break;
      default:
        positions = this.kmpAlgo.search(text, pattern);
        this.comparisons = this.kmpAlgo.getComparisons();
    }

    const endTime = performance.now();

    return {
      found: positions.length > 0,
      positions: positions,
      comparisons: this.comparisons,
      executionTime: endTime - startTime,
      algorithm: algorithm,
    };
  }

  // Mengecek apakah pattern cocok menggunakan algoritma yang ditentukan
  match(text, pattern, algorithm = "kmp") {
    const result = this.search(text, pattern, algorithm);
    return result.found;
  }

  // Menyorot pattern yang cocok dalam teks
  highlightMatches(text, pattern, algorithm = "kmp") {
    if (!pattern || pattern.length === 0) return text;

    const result = this.search(text, pattern, algorithm);

    if (!result.found) return text;

    const positions = result.positions.sort((a, b) => b - a);
    let highlightedText = text;

    for (const pos of positions) {
      const before = highlightedText.substring(0, pos);
      const match = highlightedText.substring(pos, pos + pattern.length);
      const after = highlightedText.substring(pos + pattern.length);
      highlightedText =
        before + '<span class="highlight">' + match + "</span>" + after;
    }

    return highlightedText;
  }

  // Membandingkan performa semua algoritma
  compareAlgorithms(text, pattern) {
    const results = {
      kmp: this.search(text, pattern, "kmp"),
      boyerMoore: this.search(text, pattern, "boyermoore"),
      bruteForce: this.search(text, pattern, "bruteforce"),
    };

    return results;
  }
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = StringMatchingAlgorithms;
}
