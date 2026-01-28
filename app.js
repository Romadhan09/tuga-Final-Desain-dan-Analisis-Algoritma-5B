// Aplikasi Utama - Sistem Pencarian Tempat Wisata Indonesia

let tourismData = [];
let filteredData = [];
let stringMatcher = new StringMatchingAlgorithms();
let performanceChart = null;
let searchHistory = [];

const searchInput = document.getElementById("searchInput");
const clearBtn = document.getElementById("clearBtn");
const searchBtn = document.getElementById("searchBtn");
const categoryFilter = document.getElementById("categoryFilter");
const cityFilter = document.getElementById("cityFilter");
const ratingFilter = document.getElementById("ratingFilter");
const resultsContainer = document.getElementById("results");
const searchStats = document.getElementById("searchStats");
const loading = document.getElementById("loading");
const modal = document.getElementById("placeModal");
const modalBody = document.getElementById("modalBody");
const closeModal = document.querySelector(".close-modal");

// Memuat dan parsing data CSV
async function loadData() {
  try {
    showLoading(true);
    const response = await fetch("dataset/tourism_with_id.csv");
    const csvText = await response.text();
    tourismData = parseCSV(csvText);
    filteredData = [...tourismData];

    populateFilters();
    displayResults(tourismData.slice(0, 12));
    showLoading(false);

    console.log(`Loaded ${tourismData.length} tourism places`);
  } catch (error) {
    console.error("Error loading data:", error);
    showLoading(false);
    resultsContainer.innerHTML = `
            <div class="no-results">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Error Loading Data</h3>
                <p>Gagal memuat data. Pastikan file CSV tersedia.</p>
            </div>
        `;
  }
}

// Mengubah teks CSV menjadi array objek
function parseCSV(csvText) {
  const lines = csvText.split("\n");
  const headers = lines[0].split(",");
  const data = [];

  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === "") continue;

    const values = parseCSVLine(lines[i]);
    const place = {
      id: parseInt(values[0]) || i,
      name: values[1] || "",
      description: values[2] || "",
      category: values[3] || "",
      city: values[4] || "",
      price: parseInt(values[5]) || 0,
      rating: parseFloat(values[6]) || 0,
      timeMinutes: parseInt(values[7]) || 0,
      coordinate: values[8] || "",
      lat: parseFloat(values[9]) || 0,
      lng: parseFloat(values[10]) || 0,
    };

    if (place.name) {
      data.push(place);
    }
  }

  return data;
}

// Parsing satu baris CSV dengan penanganan field berkutip
function parseCSVLine(line) {
  const values = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      values.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  values.push(current.trim());

  return values;
}

// Mengisi dropdown filter dengan nilai unik
function populateFilters() {
  const categories = [
    ...new Set(tourismData.map((p) => p.category).filter((c) => c)),
  ];
  categories.sort();

  categoryFilter.innerHTML = '<option value="">Semua Kategori</option>';
  categories.forEach((cat) => {
    categoryFilter.innerHTML += `<option value="${cat}">${cat}</option>`;
  });

  const cities = [...new Set(tourismData.map((p) => p.city).filter((c) => c))];
  cities.sort();

  cityFilter.innerHTML = '<option value="">Semua Kota</option>';
  cities.forEach((city) => {
    cityFilter.innerHTML += `<option value="${city}">${city}</option>`;
  });
}

// Melakukan pencarian dengan algoritma yang dipilih
function performSearch() {
  const query = searchInput.value.trim();
  const algorithm = document.getElementById("selectedAlgorithm").value;
  const category = categoryFilter.value;
  const city = cityFilter.value;
  const minRating = parseFloat(ratingFilter.value) || 0;

  showLoading(true);
  searchStats.style.display = "none";

  setTimeout(() => {
    const startTime = performance.now();
    let totalComparisons = 0;
    let results = [];

    if (query === "") {
      results = tourismData.filter((place) => {
        const categoryMatch = !category || place.category === category;
        const cityMatch = !city || place.city === city;
        const ratingMatch = place.rating >= minRating;
        return categoryMatch && cityMatch && ratingMatch;
      });
    } else {
      results = tourismData.filter((place) => {
        const nameResult = stringMatcher.search(place.name, query, algorithm);
        const descResult = stringMatcher.search(
          place.description,
          query,
          algorithm,
        );

        totalComparisons += nameResult.comparisons + descResult.comparisons;

        const matchFound = nameResult.found || descResult.found;

        const categoryMatch = !category || place.category === category;
        const cityMatch = !city || place.city === city;
        const ratingMatch = place.rating >= minRating;

        return matchFound && categoryMatch && cityMatch && ratingMatch;
      });
    }

    const endTime = performance.now();
    const executionTime = (endTime - startTime).toFixed(2);

    updateSearchStats(
      executionTime,
      results.length,
      algorithm,
      totalComparisons,
    );

    if (query !== "") {
      searchHistory.push({
        query: query,
        algorithm: algorithm,
        time: parseFloat(executionTime),
        comparisons: totalComparisons,
        results: results.length,
      });
      updatePerformanceChart();
    }

    displayResults(results, query, algorithm);
    showLoading(false);
  }, 100);
}

// Memperbarui tampilan statistik pencarian
function updateSearchStats(time, count, algorithm, comparisons) {
  document.getElementById("execTime").textContent = time;
  document.getElementById("resultCount").textContent = count;
  document.getElementById("usedAlgorithm").textContent =
    getAlgorithmName(algorithm);
  document.getElementById("comparisonCount").textContent =
    comparisons.toLocaleString();
  searchStats.style.display = "flex";
}

// Mendapatkan nama algoritma yang mudah dibaca
function getAlgorithmName(algo) {
  const names = {
    kmp: "KMP (Knuth-Morris-Pratt)",
    boyermoore: "Boyer-Moore",
    bruteforce: "Brute Force",
  };
  return names[algo] || algo;
}

// Menampilkan hasil pencarian
function displayResults(data, query = "", algorithm = "kmp") {
  if (data.length === 0) {
    resultsContainer.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>Tidak Ada Hasil</h3>
                <p>Tidak ditemukan tempat wisata yang sesuai dengan pencarian Anda.</p>
            </div>
        `;
    return;
  }

  let html = "";
  data.forEach((place) => {
    const highlightedName = query
      ? stringMatcher.highlightMatches(place.name, query, algorithm)
      : place.name;

    const categoryIcon = getCategoryIcon(place.category);
    const priceText =
      place.price === 0
        ? "Gratis"
        : `Rp ${place.price.toLocaleString("id-ID")}`;

    html += `
            <div class="place-card" onclick="showPlaceDetail(${place.id})">
                <div class="card-image">
                    <i class="${categoryIcon}"></i>
                    <span class="card-category">${place.category}</span>
                    <span class="card-rating">
                        <i class="fas fa-star"></i>
                        ${place.rating.toFixed(1)}
                    </span>
                </div>
                <div class="card-content">
                    <h3>${highlightedName}</h3>
                    <p class="card-location">
                        <i class="fas fa-map-marker-alt"></i>
                        ${place.city}
                    </p>
                    <p class="card-description">${truncateText(place.description, 120)}</p>
                    <div class="card-footer">
                        <span class="card-price">${priceText}</span>
                        <button class="card-btn">Lihat Detail</button>
                    </div>
                </div>
            </div>
        `;
  });

  resultsContainer.innerHTML = html;
}

// Menampilkan detail tempat dalam modal
function showPlaceDetail(placeId) {
  const place = tourismData.find((p) => p.id === placeId);
  if (!place) return;

  const categoryIcon = getCategoryIcon(place.category);
  const priceText =
    place.price === 0 ? "Gratis" : `Rp ${place.price.toLocaleString("id-ID")}`;
  const timeText =
    place.timeMinutes > 0 ? `${place.timeMinutes} menit` : "Tidak tersedia";

  modalBody.innerHTML = `
        <div class="modal-header">
            <i class="${categoryIcon}"></i>
        </div>
        <div class="modal-body">
            <h2 class="modal-title">${place.name}</h2>
            <div class="modal-meta">
                <div class="modal-meta-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${place.city}</span>
                </div>
                <div class="modal-meta-item">
                    <i class="fas fa-tag"></i>
                    <span>${place.category}</span>
                </div>
                <div class="modal-meta-item">
                    <i class="fas fa-star"></i>
                    <span>${place.rating.toFixed(1)} / 5.0</span>
                </div>
            </div>
            <p class="modal-description">${place.description}</p>
            <div class="modal-info">
                <div class="info-item">
                    <label>Harga Tiket</label>
                    <span>${priceText}</span>
                </div>
                <div class="info-item">
                    <label>Waktu Kunjungan</label>
                    <span>${timeText}</span>
                </div>
                <div class="info-item">
                    <label>Koordinat</label>
                    <span>${place.lat.toFixed(6)}, ${place.lng.toFixed(6)}</span>
                </div>
                <div class="info-item">
                    <label>ID Tempat</label>
                    <span>#${place.id}</span>
                </div>
            </div>
            <div class="modal-actions">
                <button class="btn-maps" onclick="openGoogleMaps(${place.lat}, ${place.lng}, '${place.name.replace(/'/g, "\\'")}')">
                    <i class="fas fa-map-marked-alt"></i>
                    Buka di Google Maps
                </button>
                <button class="btn-directions" onclick="openDirections(${place.lat}, ${place.lng})">
                    <i class="fas fa-directions"></i>
                    Petunjuk Arah
                </button>
            </div>
        </div>
    `;

  modal.classList.add("active");
}

// Membuka lokasi di Google Maps
function openGoogleMaps(lat, lng, name) {
  const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=${encodeURIComponent(name)}`;
  window.open(url, "_blank");
}

// Membuka petunjuk arah di Google Maps
function openDirections(lat, lng) {
  const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  window.open(url, "_blank");
}

// Mendapatkan ikon berdasarkan kategori
function getCategoryIcon(category) {
  const icons = {
    Budaya: "fas fa-landmark",
    "Taman Hiburan": "fas fa-ticket-alt",
    "Cagar Alam": "fas fa-tree",
    Bahari: "fas fa-water",
    "Pusat Perbelanjaan": "fas fa-shopping-bag",
    "Tempat Ibadah": "fas fa-mosque",
  };
  return icons[category] || "fas fa-map-marker-alt";
}

// Memotong teks sesuai panjang maksimal
function truncateText(text, maxLength) {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

// Menampilkan/menyembunyikan spinner loading
function showLoading(show) {
  loading.style.display = show ? "block" : "none";
  if (show) {
    resultsContainer.innerHTML = "";
  }
}

// Inisialisasi grafik performa
function initPerformanceChart() {
  const ctx = document.getElementById("performanceChart").getContext("2d");

  performanceChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["KMP", "Boyer-Moore", "Brute Force"],
      datasets: [
        {
          label: "Waktu Eksekusi (ms)",
          data: [0, 0, 0],
          backgroundColor: [
            "rgba(37, 99, 235, 0.7)",
            "rgba(16, 185, 129, 0.7)",
            "rgba(245, 158, 11, 0.7)",
          ],
          borderColor: [
            "rgba(37, 99, 235, 1)",
            "rgba(16, 185, 129, 1)",
            "rgba(245, 158, 11, 1)",
          ],
          borderWidth: 2,
          borderRadius: 8,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: "top",
        },
        title: {
          display: true,
          text: "Perbandingan Waktu Eksekusi Algoritma",
          font: {
            size: 16,
            weight: "bold",
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Waktu (ms)",
          },
        },
      },
    },
  });
}

// Memperbarui grafik dengan data perbandingan
function updatePerformanceChart() {
  if (!performanceChart || searchHistory.length === 0) return;

  const lastSearch = searchHistory[searchHistory.length - 1];

  if (lastSearch && lastSearch.query) {
    const comparison = runAlgorithmComparison(lastSearch.query);

    performanceChart.data.datasets[0].data = [
      comparison.kmp.time,
      comparison.boyerMoore.time,
      comparison.bruteForce.time,
    ];

    performanceChart.update();
  }
}

// Menjalankan perbandingan untuk semua algoritma
function runAlgorithmComparison(query) {
  const results = {
    kmp: { time: 0, comparisons: 0 },
    boyerMoore: { time: 0, comparisons: 0 },
    bruteForce: { time: 0, comparisons: 0 },
  };

  let startTime = performance.now();
  tourismData.forEach((place) => {
    stringMatcher.search(place.name + " " + place.description, query, "kmp");
  });
  results.kmp.time = parseFloat((performance.now() - startTime).toFixed(2));
  results.kmp.comparisons = stringMatcher.getComparisons();

  startTime = performance.now();
  tourismData.forEach((place) => {
    stringMatcher.search(
      place.name + " " + place.description,
      query,
      "boyermoore",
    );
  });
  results.boyerMoore.time = parseFloat(
    (performance.now() - startTime).toFixed(2),
  );
  results.boyerMoore.comparisons = stringMatcher.getComparisons();

  startTime = performance.now();
  tourismData.forEach((place) => {
    stringMatcher.search(
      place.name + " " + place.description,
      query,
      "bruteforce",
    );
  });
  results.bruteForce.time = parseFloat(
    (performance.now() - startTime).toFixed(2),
  );
  results.bruteForce.comparisons = stringMatcher.getComparisons();

  return results;
}

// Pendengar Event
document.addEventListener("DOMContentLoaded", () => {
  loadData();
  initPerformanceChart();

  searchBtn.addEventListener("click", performSearch);

  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      performSearch();
    }
  });

  searchInput.addEventListener("input", () => {
    clearBtn.style.display = searchInput.value ? "block" : "none";
  });

  clearBtn.addEventListener("click", () => {
    searchInput.value = "";
    clearBtn.style.display = "none";
    searchStats.style.display = "none";
    displayResults(tourismData.slice(0, 12));
  });

  categoryFilter.addEventListener("change", performSearch);
  cityFilter.addEventListener("change", performSearch);
  ratingFilter.addEventListener("change", performSearch);

  const algoBtns = document.querySelectorAll(".algo-btn");
  algoBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      algoBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById("selectedAlgorithm").value =
        btn.dataset.algorithm;

      if (searchInput.value.trim()) {
        performSearch();
      }
    });
  });

  closeModal.addEventListener("click", () => {
    modal.classList.remove("active");
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("active");
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) {
      modal.classList.remove("active");
    }
  });

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  window.addEventListener("scroll", () => {
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".nav-links a");

    let current = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 100;
      if (scrollY >= sectionTop) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  });
});

window.showPlaceDetail = showPlaceDetail;
window.openGoogleMaps = openGoogleMaps;
window.openDirections = openDirections;
