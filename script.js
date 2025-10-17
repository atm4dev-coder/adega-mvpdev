// Configuração do WhatsApp (ALTERE ESTE NÚMERO PARA O SEU)
const WHATSAPP_NUMBER = '5581986097163'; // Formato: Código do país + DDD + Número (sem espaços ou caracteres especiais)

// Estado da aplicação
let cart = [];

// Elementos DOM
const customerNameInput = document.getElementById('customerName');
const customerBlockInput = document.getElementById('customerBlock');
const customerAptInput = document.getElementById('customerApt');
const paymentCardRadio = document.getElementById('paymentCard');
const paymentPixRadio = document.getElementById('paymentPix');
const changeNoRadio = document.getElementById('changeNo');
const changeYesRadio = document.getElementById('changeYes');
const changeSection = document.getElementById('changeSection');
const changeAmountDiv = document.getElementById('changeAmountDiv');
const changeAmountInput = document.getElementById('changeAmount');
const orderItemsDiv = document.getElementById('orderItems');
const totalPriceSpan = document.getElementById('totalPrice');
const btnFinishOrder = document.getElementById('btnFinishOrder');

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    initializeProductControls();
    initializePaymentControls();
    updateOrderSummary();
    
    // Event listeners para inputs do cliente
    customerNameInput.addEventListener('input', validateForm);
    customerBlockInput.addEventListener('input', validateForm);
    customerAptInput.addEventListener('input', validateForm);
    
    // Event listeners para pagamento
    paymentCardRadio.addEventListener('change', validateForm);
    paymentPixRadio.addEventListener('change', validateForm);
    
    // Event listener para botão de finalizar
    btnFinishOrder.addEventListener('click', sendToWhatsApp);
});

// Inicializar controles de pagamento
function initializePaymentControls() {
    // Mostrar seção de troco apenas se Pix for selecionado
    paymentPixRadio.addEventListener('change', function() {
        if (this.checked) {
            changeSection.style.display = 'block';
        }
    });
    
    paymentCardRadio.addEventListener('change', function() {
        if (this.checked) {
            changeSection.style.display = 'none';
            changeAmountDiv.style.display = 'none';
            changeNoRadio.checked = true;
        }
    });
    
    // Mostrar campo de valor do troco
    changeYesRadio.addEventListener('change', function() {
        if (this.checked) {
            changeAmountDiv.style.display = 'block';
        }
    });
    
    changeNoRadio.addEventListener('change', function() {
        if (this.checked) {
            changeAmountDiv.style.display = 'none';
            changeAmountInput.value = '';
        }
    });
}

// Inicializar controles de quantidade dos produtos
function initializeProductControls() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        const btnMinus = card.querySelector('.btn-minus');
        const btnPlus = card.querySelector('.btn-plus');
        const quantityInput = card.querySelector('.quantity');
        const productName = card.dataset.name;
        const productPrice = parseFloat(card.dataset.price);
        
        btnPlus.addEventListener('click', function() {
            let currentValue = parseInt(quantityInput.value);
            currentValue++;
            quantityInput.value = currentValue;
            updateCart(productName, productPrice, currentValue);
        });
        
        btnMinus.addEventListener('click', function() {
            let currentValue = parseInt(quantityInput.value);
            if (currentValue > 0) {
                currentValue--;
                quantityInput.value = currentValue;
                updateCart(productName, productPrice, currentValue);
            }
        });
    });
}

// Atualizar carrinho
function updateCart(productName, productPrice, quantity) {
    // Procurar se o produto já existe no carrinho
    const existingItemIndex = cart.findIndex(item => item.name === productName);
    
    if (quantity === 0) {
        // Remover item se quantidade for zero
        if (existingItemIndex !== -1) {
            cart.splice(existingItemIndex, 1);
        }
    } else {
        // Adicionar ou atualizar item
        if (existingItemIndex !== -1) {
            cart[existingItemIndex].quantity = quantity;
            cart[existingItemIndex].subtotal = quantity * productPrice;
        } else {
            cart.push({
                name: productName,
                price: productPrice,
                quantity: quantity,
                subtotal: quantity * productPrice
            });
        }
    }
    
    updateOrderSummary();
    validateForm();
}

// Atualizar resumo do pedido
function updateOrderSummary() {
    if (cart.length === 0) {
        orderItemsDiv.innerHTML = '<p class="empty-cart">Seu carrinho está vazio</p>';
        totalPriceSpan.textContent = 'R$ 0,00';
        return;
    }
    
    let html = '';
    let total = 0;
    
    cart.forEach(item => {
        html += `
            <div class="order-item">
                <div>
                    <div class="order-item-name">${item.name}</div>
                    <div class="order-item-details">${item.quantity}x R$ ${item.price.toFixed(2)}</div>
                </div>
                <div class="order-item-price">R$ ${item.subtotal.toFixed(2)}</div>
            </div>
        `;
        total += item.subtotal;
    });
    
    orderItemsDiv.innerHTML = html;
    totalPriceSpan.textContent = `R$ ${total.toFixed(2)}`;
}

// Validar formulário
function validateForm() {
    const name = customerNameInput.value.trim();
    const block = customerBlockInput.value.trim();
    const apt = customerAptInput.value.trim();
    const hasItems = cart.length > 0;
    const paymentSelected = paymentCardRadio.checked || paymentPixRadio.checked;
    
    if (name && block && apt && hasItems && paymentSelected) {
        btnFinishOrder.disabled = false;
    } else {
        btnFinishOrder.disabled = true;
    }
}

// Enviar pedido para WhatsApp
function sendToWhatsApp() {
    const name = customerNameInput.value.trim();
    const block = customerBlockInput.value.trim();
    const apt = customerAptInput.value.trim();
    
    if (!name || !block || !apt || cart.length === 0) {
        alert('Por favor, preencha todos os campos e adicione produtos ao carrinho.');
        return;
    }
    
    // Obter método de pagamento
    let paymentMethod = '';
    if (paymentCardRadio.checked) {
        paymentMethod = 'Cartão';
    } else if (paymentPixRadio.checked) {
        paymentMethod = 'Pix';
    }
    
    if (!paymentMethod) {
        alert('Por favor, selecione um método de pagamento.');
        return;
    }
    
    // Construir mensagem
    let message = `🍷 *NOVO PEDIDO - ADEGA DO CONDOMÍNIO*\n\n`;
    message += `👤 *Cliente:* ${name}\n`;
    message += `🏢 *Bloco:* ${block}\n`;
    message += `🚪 *Apartamento:* ${apt}\n\n`;
    message += `💳 *Pagamento:* ${paymentMethod}\n`;
    
    // Adicionar informações de troco se Pix e precisa de troco
    if (paymentPixRadio.checked && changeYesRadio.checked) {
        const changeAmount = changeAmountInput.value.trim();
        if (changeAmount) {
            message += `💵 *Troco para:* R$ ${parseFloat(changeAmount).toFixed(2)}\n`;
        } else {
            message += `💵 *Precisa de troco* (valor não especificado)\n`;
        }
    } else if (paymentPixRadio.checked) {
        message += `💵 *Troco:* Não precisa\n`;
    }
    
    message += `\n📋 *ITENS DO PEDIDO:*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━\n`;
    
    let total = 0;
    cart.forEach(item => {
        message += `\n▪️ ${item.name}\n`;
        message += `   ${item.quantity}x R$ ${item.price.toFixed(2)} = R$ ${item.subtotal.toFixed(2)}\n`;
        total += item.subtotal;
    });
    
    message += `\n━━━━━━━━━━━━━━━━━━━━\n`;
    message += `💰 *TOTAL: R$ ${total.toFixed(2)}*\n\n`;
    message += `⏰ Aguardando confirmação e entrega!`;
    
    // Codificar mensagem para URL
    const encodedMessage = encodeURIComponent(message);
    
    // Criar link do WhatsApp
    const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    
    // Abrir WhatsApp
    window.open(whatsappURL, '_blank');
    
    // Opcional: Limpar formulário após envio
    // setTimeout(() => {
    //     resetForm();
    // }, 1000);
}

// Função para resetar o formulário (opcional)
function resetForm() {
    customerNameInput.value = '';
    customerBlockInput.value = '';
    customerAptInput.value = '';
    paymentCardRadio.checked = false;
    paymentPixRadio.checked = false;
    changeNoRadio.checked = true;
    changeAmountInput.value = '';
    changeSection.style.display = 'none';
    changeAmountDiv.style.display = 'none';
    
    const quantityInputs = document.querySelectorAll('.quantity');
    quantityInputs.forEach(input => {
        input.value = '0';
    });
    
    cart = [];
    updateOrderSummary();
    validateForm();
}

// Formatar preço
function formatPrice(value) {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
}

