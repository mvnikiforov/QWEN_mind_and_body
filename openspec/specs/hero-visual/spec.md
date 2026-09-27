# hero-visual Spec

## Purpose

Определяет визуальное представление кругового элемента (HeroVisual) в hero-блоке: масштаб, вращающиеся кольца, фразы над/под кругом, адаптивное поведение для мобильных и десктопных экранов.

## Requirements

### Requirement: Mobile scale factor
На мобильных экранах (ниже breakpoint `lg`) компонент HeroVisual ДОЛЖЕН отображаться с коэффициентом масштабирования 0.9.

#### Scenario: Mobile viewport renders circle at 0.9 scale
- **WHEN** страница отображается на экране шириной менее `lg` breakpoint
- **THEN** компонент HeroVisual в мобильной копии применяет `scale={0.9}`

#### Scenario: Desktop viewport unaffected
- **WHEN** страница отображается на экране шириной `lg` или больше
- **THEN** компонент HeroVisual в десктопной колонке использует масштаб по умолчанию (scale=1), значение 0.9 не применяется

### Requirement: Phrase shift proportional to scale
Пиксельные сдвиги фраз над и под кругом (`shiftUpPx`, `shiftDownPx`) ДОЛЖНЫ быть пропорциональны коэффициенту масштабирования, чтобы сохранить визуальную геометрию элемента.

#### Scenario: Mobile phrase shifts match new scale
- **WHEN** мобильная версия HeroVisual отображается с scale=0.9
- **THEN** `shiftUpPx` и `shiftDownPx` ДОЛЖНЫ быть равны 23 (округлённое значение 21 × 0.9/0.84 ≈ 22.5)