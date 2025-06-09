document.addEventListener("DOMContentLoaded", () => {
    const hamburgerBtn = document.getElementById("hamburgerBtn");
    const popupMenu = document.getElementById("popupMenu");
    const overlay = document.getElementById("overlay");

    if (hamburgerBtn && popupMenu && overlay) {
        hamburgerBtn.addEventListener("click", () => {
            popupMenu.classList.toggle("open");
            overlay.classList.toggle("open");
        });

        overlay.addEventListener("click", () => {
            popupMenu.classList.remove("open");
            overlay.classList.remove("open");
        });
    } else {
        console.error("Um ou mais elementos do menu (botão, menu popup ou overlay) não foram encontrados.");
    }
});

document.addEventListener('DOMContentLoaded', () => {
  new InventoryManager();
});

class InventoryManager {
  constructor() {
    this.items = [];

    this.itemForm = document.getElementById('item-form');
    this.itemsList = document.getElementById('items-list');
    this.nameInput = document.getElementById('item-name');
    this.quantityInput = document.getElementById('item-quantity');
    this.expiryInput = document.getElementById('item-expiry');
    this.categoryInput = document.getElementById('item-category');
    this.totalCountEl = document.getElementById('total-count');
    this.expiringCountEl = document.getElementById('expiring-count');
    this.expiredCountEl = document.getElementById('expired-count');

    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1;
    let dd = today.getDate();
    if (mm < 10) mm = `0${mm}`;
    if (dd < 10) dd = `0${dd}`;
    this.expiryInput.min = `${yyyy}-${mm}-${dd}`;

    this.itemForm.addEventListener('submit', this.handleFormSubmit.bind(this));

    this.addSampleItems();
    this.renderItems();
    this.updateStats();
  }

  addSampleItems() {
    const today = new Date();
    const futureDate1 = new Date(today);
    futureDate1.setDate(today.getDate() + 90);

    const futureDate2 = new Date(today);
    futureDate2.setDate(today.getDate() + 20);

    const pastDate = new Date(today);
    pastDate.setDate(today.getDate() - 10);

    this.items = [
      {
        id: this.generateId(),
        name: 'Dipirona 500mg',
        quantity: 50,
        expiryDate: futureDate1,
        category: 'Medicamento',
        createdAt: new Date()
      },
      {
        id: this.generateId(),
        name: 'Soro Fisiológico 100ml',
        quantity: 25,
        expiryDate: futureDate2,
        category: 'Medicamento',
        createdAt: new Date()
      },
      {
        id: this.generateId(),
        name: 'Luvas de Procedimento',
        quantity: 100,
        expiryDate: pastDate,
        category: 'Material',
        createdAt: new Date()
      }
    ];
  }

  handleFormSubmit(e) {
    e.preventDefault();

    const name = this.nameInput.value.trim();
    const quantity = parseInt(this.quantityInput.value, 10);
    const expiryDate = new Date(this.expiryInput.value);
    const category = this.categoryInput.value;

    if (!name || isNaN(quantity) || !expiryDate || !category) {
      alert('Por favor, preencha todos os campos corretamente.');
      return;
    }

    const newItem = {
      id: this.generateId(),
      name,
      quantity,
      expiryDate,
      category,
      createdAt: new Date()
    };

    this.items.push(newItem);
    this.itemForm.reset();
    this.renderItems();
    this.updateStats();
    this.showToast(`${name} adicionado com sucesso!`);
  }

  removeItem(id) {
    const index = this.items.findIndex(i => i.id === id);
    if (index === -1) return;
    const removed = this.items[index];
    this.items.splice(index, 1);
    this.renderItems();
    this.updateStats();
    this.showToast(`${removed.name} removido do estoque.`);
  }

  checkExpiryStatus(date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(date);
    expiry.setHours(0, 0, 0, 0);

    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { status: 'expired', daysRemaining: diffDays };
    if (diffDays <= 30) return { status: 'expiring-soon', daysRemaining: diffDays };
    return { status: 'normal', daysRemaining: diffDays };
  }

  renderItems() {
    if (this.items.length === 0) {
      this.itemsList.innerHTML = '<div class="no-items"><p>Nenhum item cadastrado no momento.</p></div>';
      return;
    }

    const sortedItems = [...this.items].sort((a, b) => {
      const aStatus = this.checkExpiryStatus(a.expiryDate);
      const bStatus = this.checkExpiryStatus(b.expiryDate);

      const priority = { expired: 0, 'expiring-soon': 1, normal: 2 };
      return priority[aStatus.status] - priority[bStatus.status] || aStatus.daysRemaining - bStatus.daysRemaining;
    });

    this.itemsList.innerHTML = '';

    for (const item of sortedItems) {
      const { status, daysRemaining } = this.checkExpiryStatus(item.expiryDate);
      const formattedDate = this.formatDate(item.expiryDate);
      let expiryText = '';
      let expiryClass = '';

      if (status === 'expired') {
        expiryText = `Vencido há ${Math.abs(daysRemaining)} dias`;
        expiryClass = 'expiry-danger';
      } else {
        expiryText = `Vence em ${daysRemaining} dias`;
        if (status === 'expiring-soon') expiryClass = 'expiry-warning';
      }

      const itemEl = document.createElement('div');
      itemEl.className = `item-card ${status}`;
      itemEl.innerHTML = `
        <div class="item-info">
          <h3>${item.name}</h3>
          <p><strong>Quantidade:</strong> ${item.quantity}</p>
          <p><strong>Categoria:</strong> ${item.category}</p>
          <p><strong>Validade:</strong> ${formattedDate}</p>
          <p class="${expiryClass}">${expiryText}</p>
        </div>
        <div class="actions">
          <button class="delete-btn" data-id="${item.id}">Remover</button>
        </div>
      `;

      itemEl.querySelector('.delete-btn').addEventListener('click', () => this.removeItem(item.id));
      this.itemsList.appendChild(itemEl);
    }
  }

  updateStats() {
    const total = this.items.length;
    const expiring = this.items.filter(i => this.checkExpiryStatus(i.expiryDate).status === 'expiring-soon').length;
    const expired = this.items.filter(i => this.checkExpiryStatus(i.expiryDate).status === 'expired').length;

    this.totalCountEl.textContent = total;
    this.expiringCountEl.textContent = expiring;
    this.expiredCountEl.textContent = expired;
  }

  formatDate(date) {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  generateId() {
    return Math.random().toString(36).substr(2, 9);
  }

  showToast(msg) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
  }
}

document.addEventListener("DOMContentLoaded", () => {
    const hamburgerBtn = document.getElementById("hamburgerBtn");
    const popupMenu = document.getElementById("popupMenu");
    const overlay = document.getElementById("overlay");

    if (hamburgerBtn && popupMenu && overlay) {
        hamburgerBtn.addEventListener("click", () => {
            popupMenu.classList.toggle("open");
            overlay.classList.toggle("open");
        });

        overlay.addEventListener("click", () => {
            popupMenu.classList.remove("open");
            overlay.classList.remove("open");
        });
    } else {
        console.error("Um ou mais elementos do menu (botão, menu popup ou overlay) não foram encontrados.");
    }
});


