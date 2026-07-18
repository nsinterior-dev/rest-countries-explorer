import { ReactNode } from 'react';
import { Banner, Container, Button } from '@/components'
import { ButtonSize, ButtonVariant } from '@/components/Button/variants';

const sizes: ButtonSize[] = ["sm", "md", "lg"]
const variants: ButtonVariant[] = ["primary", "secondary", "text", "error"]


const components: Array<{label: string, component: ReactNode}> = [
  {
    label: "Banner",
    component: <Banner title="Country Explorer" description="Explore the world's countries" />
  },
  {
    label: 'Button',
    component: <div className="flex flex-col gap-1">
      {variants.map((variant) => (
        <div key={variant} className="flex flex-wrap items-start gap-2">
          {sizes.map((size) => (
            <Button variant={variant} size={size} key={`${variant}-${size}`}>
              {`${variant} ${size}`}
            </Button>
          ))}
        </div>
      ))}
    </div>
  }
]

export default function ComponentsPage() {
  return (
    <div className="flex flex-col gap-4" >
        {components.map(({label, component}) => (
          <Container key={label}>
            <h3 className="font-medium zinc-600">{label}</h3>
            {component}
          </Container>
        ))}
    </div>
  )
}
