# Proyecto: Ecommerce Rent a Car

## Descripción General

Este proyecto consiste en el desarrollo de una **plataforma web tipo ecommerce para una empresa de alquiler de vehículos (Rent a Car)**, orientada a clientes nacionales y extranjeros.

El sistema permitirá a los clientes consultar vehículos disponibles, seleccionar fechas de renta, calcular automáticamente el costo total y realizar reservas en línea. Además, contará con un panel administrativo para la gestión interna de la empresa.

---

## Objetivo del Sistema

Digitalizar y optimizar el proceso de alquiler de vehículos mediante:

- Gestión de reservas en línea
- Control de disponibilidad en tiempo real
- Administración de clientes
- Registro de pagos
- Panel administrativo para gestión operativa

---

## Giro del Negocio

La empresa se dedica al **alquiler temporal de vehículos por día**.

Ofrece diferentes categorías de vehículos, tales como:

- Económicos
- SUV
- Pickup
- Lujo

### Modelo de Ingresos

La empresa genera ingresos a través de:

- Precio por día de renta
- Depósito de garantía (opcional en la demo)
- Cargos adicionales o penalizaciones (opcional en la demo)

---

## Tipos de Usuarios

### Cliente

- Consulta vehículos disponibles
- Visualiza detalles del vehículo
- Selecciona fechas de renta
- Realiza reservas
- Proporciona datos personales y licencia
- Realiza pagos

### Administrador

- Gestiona vehículos (crear, editar, desactivar)
- Cambia estado del vehículo (Disponible, Rentado, Mantenimiento)
- Administra reservas
- Visualiza pagos
- Gestiona clientes

---

## Flujo Principal del Negocio

1. El cliente selecciona fechas de renta.
2. El sistema valida disponibilidad del vehículo.
3. Se calcula el total:  
   `Total = PrecioPorDia × CantidadDeDías`
4. El cliente confirma la reserva.
5. Se registra el pago.
6. El vehículo cambia a estado **Rentado**.
7. Al finalizar el período, el vehículo vuelve a estado **Disponible**.

---

## Conceptos Clave del Sistema

- Un cliente puede tener múltiples reservas.
- Un vehículo puede tener múltiples reservas en diferentes fechas.
- El sistema debe evitar reservas con fechas solapadas.
- Las reservas tienen estados: Pendiente, Confirmada, Cancelada, Finalizada.
- Los vehículos tienen estados: Disponible, Rentado, Mantenimiento.

---

## Alcance de la Demo

Esta demo tiene como objetivo demostrar:

- Flujo funcional de reserva
- Gestión básica administrativa
- Cálculo automático de costos
- Control de disponibilidad
- Estructura de base de datos sólida y escalable

No incluye procesos contables avanzados ni integraciones complejas externas.

---

## Enfoque Técnico

El sistema se desarrollará como una aplicación web con:

- Base de datos relacional
- Backend con lógica de negocio para validación de disponibilidad
- Frontend para experiencia tipo ecommerce
- Panel administrativo para control interno

---

## Resultado Esperado

Una plataforma funcional que permita:

- Mostrar profesionalismo ante clientes potenciales
- Validar la viabilidad del sistema
- Servir como base escalable para una versión empresarial completa
