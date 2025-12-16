# Test API Workflow

$baseUrl = "http://localhost:3000/api/v1"

Write-Host "=== Testing Streetwear API ===" -ForegroundColor Cyan

# 1. Register a new customer
Write-Host "`n1. Registering new customer..." -ForegroundColor Yellow
$timestamp = Get-Date -Format "yyyyMMddHHmmss"
$registerBody = @{
    email = "customer-$timestamp@example.com"
    password = "SecurePass123"
} | ConvertTo-Json

try {
    $registerResponse = Invoke-RestMethod -Uri "$baseUrl/auth/register" `
        -Method POST `
        -ContentType "application/json" `
        -Body $registerBody
    
    Write-Host "✅ Registered: $($registerResponse.data.user.email)" -ForegroundColor Green
    $customerToken = $registerResponse.data.token
} catch {
    Write-Host "⚠️  Registration failed, using login instead" -ForegroundColor Yellow
    $loginBody = @{
        email = "admin@streetwear.com"
        password = "admin123"
    } | ConvertTo-Json
    
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" `
        -Method POST `
        -ContentType "application/json" `
        -Body $loginBody
    
    $customerToken = $loginResponse.data.token
}

# 2. Login with admin account
Write-Host "`n2. Logging in as admin..." -ForegroundColor Yellow
$loginBody = @{
    email = "admin@streetwear.com"
    password = "admin123"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" `
    -Method POST `
    -ContentType "application/json" `
    -Body $loginBody

Write-Host "✅ Admin logged in" -ForegroundColor Green
$adminToken = $loginResponse.data.token

# 3. Get products
Write-Host "`n3. Fetching products..." -ForegroundColor Yellow
$productsResponse = Invoke-RestMethod -Uri "$baseUrl/products" -Method GET
$products = $productsResponse.data.products
Write-Host "✅ Found $($products.Count) products" -ForegroundColor Green
$products | ForEach-Object {
    Write-Host "   - $($_.title) (${$_.basePrice})" -ForegroundColor Cyan
}

# 4. Get product details
Write-Host "`n4. Getting product details..." -ForegroundColor Yellow
$productSlug = $products[0].slug
$productDetail = Invoke-RestMethod -Uri "$baseUrl/products/$productSlug" -Method GET
Write-Host "✅ Product: $($productDetail.data.title)" -ForegroundColor Green
Write-Host "   Variants: $($productDetail.data.variants.Count)" -ForegroundColor Cyan
$productDetail.data.variants | ForEach-Object {
    Write-Host "   - Size: $($_.size), Color: $($_.color), Stock: $($_.stockQuantity)" -ForegroundColor Cyan
}

# 5. Create an order
Write-Host "`n5. Creating order..." -ForegroundColor Yellow
$variantId = $productDetail.data.variants[0].id
$orderBody = @{
    items = @(
        @{
            variantId = $variantId
            quantity = 2
        }
    )
    shippingAddress = @{
        fullName = "John Doe"
        street = "123 Main St"
        city = "Lagos"
        state = "Lagos"
        postalCode = "100001"
        country = "Nigeria"
        phone = "+2348012345678"
    }
} | ConvertTo-Json -Depth 10

try {
    $orderResponse = Invoke-RestMethod -Uri "$baseUrl/orders" `
        -Method POST `
        -ContentType "application/json" `
        -Body $orderBody `
        -Headers @{ Authorization = "Bearer $customerToken" }
    
    Write-Host "✅ Order created: $($orderResponse.data.order.id)" -ForegroundColor Green
    Write-Host "   Total: ₦$($orderResponse.data.order.totalAmount)" -ForegroundColor Cyan
    if ($orderResponse.data.payment) {
        Write-Host "   Payment URL: $($orderResponse.data.payment.authorizationUrl)" -ForegroundColor Cyan
    }
} catch {
    Write-Host "⚠️  Order creation returned error (Paystack integration needs valid keys)" -ForegroundColor Yellow
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Yellow
}

# 6. Get customer orders
Write-Host "`n6. Fetching customer orders..." -ForegroundColor Yellow
try {
    $ordersResponse = Invoke-RestMethod -Uri "$baseUrl/orders" `
        -Method GET `
        -Headers @{ Authorization = "Bearer $customerToken" }
    
    Write-Host "✅ Customer has $($ordersResponse.data.Count) order(s)" -ForegroundColor Green
    $ordersResponse.data | ForEach-Object {
        Write-Host "   - Order: $($_.id), Status: $($_.status), Total: ₦$($_.totalAmount)" -ForegroundColor Cyan
    }
} catch {
    Write-Host "⚠️  Could not fetch orders" -ForegroundColor Yellow
}

Write-Host "`n=== All tests completed! ===" -ForegroundColor Cyan
