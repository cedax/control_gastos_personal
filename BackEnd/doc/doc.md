# API de Gestión Financiera

## Cuentas de Débito

### Obtener todas las cuentas de débito
`GET /debit`

**Respuesta**
```json
{
  "success": true,
  "data": [
    {
      "name": "Cuenta Principal",
      "amount": 5000.00
    }
  ],
  "total": 5000.00
}
```

### Agregar cuenta de débito
`POST /debit`

**Body**
```json
{
  "name": "Cuenta Ahorro",
  "amount": 1000.00
}
```

### Actualizar cuenta de débito
`PUT /debit/:name`

**Parámetros**
- `name`: Nombre de la cuenta

**Body**
```json
{
  "amount": 1500.00
}
```

### Eliminar cuenta de débito
`DELETE /debit/:name`

**Parámetros**
- `name`: Nombre de la cuenta

## Préstamos

### Obtener todos los préstamos
`GET /loans`

**Respuesta**
```json
{
  "success": true,
  "data": [
    {
      "person": "Juan Pérez",
      "amount": 2000.00
    }
  ],
  "total": 2000.00
}
```

### Agregar préstamo
`POST /loans`

**Body**
```json
{
  "person": "María García",
  "amount": 3000.00
}
```

### Actualizar préstamo
`PUT /loans/:person`

**Parámetros**
- `person`: Nombre de la persona

**Body**
```json
{
  "amount": 2500.00
}
```

### Eliminar préstamo
`DELETE /loans/:person`

**Parámetros**
- `person`: Nombre de la persona

## Cuentas de Crédito

### Obtener todas las cuentas de crédito
`GET /credit`

**Respuesta**
```json
{
  "success": true,
  "data": [
    {
      "name": "Tarjeta Visa",
      "debt": 1500.00,
      "monthlyPayment": 300.00,
      "creditLimit": 5000.00
    }
  ],
  "total": 1500.00
}
```

### Agregar cuenta de crédito
`POST /credit`

**Body**
```json
{
  "name": "Tarjeta Mastercard",
  "debt": 2000.00,
  "monthlyPayment": 400.00,
  "creditLimit": 10000.00
}
```

### Actualizar cuenta de crédito
`PUT /credit/:name`

**Parámetros**
- `name`: Nombre de la cuenta

**Body**
```json
{
  "debt": 1800.00,
  "monthlyPayment": 350.00
}
```

### Eliminar cuenta de crédito
`DELETE /credit/:name`

**Parámetros**
- `name`: Nombre de la cuenta

## Pagos en Mensualidades

### Obtener todos los pagos en mensualidades
`GET /installments`

**Respuesta**
```json
{
  "success": true,
  "data": [
    {
      "concept": "Laptop",
      "amount": 12000.00,
      "startDate": "2024-01-01T00:00:00.000Z",
      "endDate": "2024-12-31T00:00:00.000Z",
      "totalPayments": 12
    }
  ]
}
```

### Agregar pago en mensualidades
`POST /installments`

**Body**
```json
{
  "concept": "Refrigerador",
  "amount": 15000.00,
  "startDate": "2024-01-01T00:00:00.000Z",
  "endDate": "2024-12-31T00:00:00.000Z",
  "totalPayments": 12
}
```

### Obtener pagos en mensualidades actuales
`GET /installments/current`

## Items Separados

### Obtener todos los items separados
`GET /separated`

**Respuesta**
```json
{
  "success": true,
  "data": [
    {
      "concept": "Vacaciones",
      "amount": 5000.00
    }
  ],
  "total": 5000.00
}
```

### Agregar item separado
`POST /separated`

**Body**
```json
{
  "concept": "Regalo Navidad",
  "amount": 1000.00
}
```

### Actualizar item separado
`PUT /separated/:concept`

**Parámetros**
- `concept`: Concepto del item

**Body**
```json
{
  "amount": 1200.00
}
```

### Eliminar item separado
`DELETE /separated/:concept`

**Parámetros**
- `concept`: Concepto del item

## Subcategorías de Items Separados

### Obtener subcategorías
`GET /separated/:mainCategory/subcategories`

**Parámetros**
- `mainCategory`: Categoría principal

**Respuesta**
```json
{
  "success": true,
  "data": {
    "Regalos": 500.00,
    "Comida": 300.00
  },
  "total": 800.00
}
```

### Agregar subcategoría
`POST /separated/:mainCategory/subcategories`

**Parámetros**
- `mainCategory`: Categoría principal

**Body**
```json
{
  "name": "Entretenimiento",
  "amount": 200.00
}
```

### Actualizar subcategoría
`PUT /separated/:mainCategory/subcategories/:name`

**Parámetros**
- `mainCategory`: Categoría principal
- `name`: Nombre de la subcategoría

**Body**
```json
{
  "amount": 250.00
}
```

### Eliminar subcategoría
`DELETE /separated/:mainCategory/subcategories/:name`

**Parámetros**
- `mainCategory`: Categoría principal
- `name`: Nombre de la subcategoría

## Resumen General

### Obtener resumen
`GET /summary`

**Respuesta**
```json
{
  "success": true,
  "data": {
    "debitNet": 6000.00,
    "loans": 2000.00,
    "credit": 1500.00,
    "separated": 5000.00,
    "currentInstallmentPayments": [
      {
        "concept": "Laptop",
        "amount": 1000.00,
        "startDate": "2024-01-01T00:00:00.000Z",
        "endDate": "2024-12-31T00:00:00.000Z",
        "totalPayments": 12
      }
    ]
  }
}
```

## Notas Generales

- Todos los endpoints retornan un objeto con la estructura:
  ```json
  {
    "success": boolean,
    "data": object | array,
    "message?: string
  }
  ```
- En caso de error, los endpoints retornan:
  ```json
  {
    "success": false,
    "message": "Error message"
  }
  ```
- Todos los montos están en la moneda base (se asume pesos mexicanos)
- Las fechas se manejan en formato ISO 8601