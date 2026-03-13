'use client'

import type { ProductData, ProductInfo } from '@/lib/types'

function ProductCard({ title, product, icon }: { title: string; product: ProductInfo; icon: string }) {
  const hasData = product.naam || product.url || product.afmetingen || product.gewicht

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">{icon}</span>
        <h3 className="font-semibold text-text">{title}</h3>
      </div>

      {hasData ? (
        <div className="space-y-3">
          <div>
            <p className="text-xs text-text-secondary uppercase tracking-wider">Naam</p>
            {product.url ? (
              <a
                href={product.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand hover:text-brand-hover font-medium transition-colors"
              >
                {product.naam || 'Link bekijken'}
              </a>
            ) : (
              <p className="text-text">{product.naam || '-'}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-text-secondary uppercase tracking-wider">Afmetingen</p>
              <p className="text-text font-medium">{product.afmetingen || '-'}</p>
            </div>
            <div>
              <p className="text-xs text-text-secondary uppercase tracking-wider">Gewicht</p>
              <p className="text-text font-medium">{product.gewicht || '-'}</p>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-text-secondary text-sm">Geen gegevens beschikbaar</p>
      )}
    </div>
  )
}

export default function ProductTab({ data }: { data: ProductData }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <ProductCard title="Kleinste product" product={data.kleinste} icon="📦" />
      <ProductCard title="Grootste product" product={data.grootste} icon="📐" />
      <ProductCard title="Lichtste product" product={data.lichtste} icon="🪶" />
      <ProductCard title="Zwaarste product" product={data.zwaarste} icon="⚖️" />
    </div>
  )
}
