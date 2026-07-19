'use client';

import { ReactNode, useState } from 'react';
import { Banner, Container, Button, Typography, Input, SearchInput, MenuList, MenuItem, MenuEmpty } from '@/components'
import { ButtonSize, ButtonVariant } from '@/components/Button/variants';
import { TypographyVariant, TypographyColor } from '@/components/Typography/variants';
import { InputSize } from '@/components/Input/variants';

const sizes: ButtonSize[] = ["sm", "md", "lg"]
const variants: ButtonVariant[] = ["primary", "secondary", "text", "error"]

const inputSizes: InputSize[] = ["sm", "md", "lg"]

const typographyGroups: Array<{heading: string, variants: TypographyVariant[]}> = [
  { heading: "Headings", variants: ["h1", "h2", "h3", "h4", "h5", "h6"] },
  { heading: "Body", variants: ["body1", "body2"] },
  { heading: "Subtitles", variants: ["subtitle1", "subtitle2"] },
  { heading: "Caption", variants: ["caption"] },
]
const typographyColors: TypographyColor[] = ["foreground", "muted", "accent", "danger", "inherit"]


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
  },
  {
    label: 'Typography',
    component: <div className="flex flex-col gap-4">
      {typographyGroups.map(({heading, variants: groupVariants}) => (
        <div key={heading} className="flex flex-col gap-2">
          <p className="text-xs font-medium text-muted uppercase tracking-wide">{heading}</p>
          {groupVariants.map((variant) => (
            <div key={variant} className="flex flex-wrap items-baseline gap-3">
              {typographyColors.map((color) => (
                <Typography variant={variant} color={color} key={`${variant}-${color}`}>
                  {`${variant} ${color}`}
                </Typography>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  },
  {
    label: 'Input',
    component: <div className="flex flex-col gap-3">
      {inputSizes.map((size) => (
        <Input key={size} inputSize={size} placeholder={`${size} input`} />
      ))}
      <Input inputSize="md" placeholder="disabled input" disabled />
    </div>
  }
]

function SearchInputDemo() {
  const [value, setValue] = useState('');

  return (
    <div className="flex flex-col gap-3">
      {inputSizes.map((size) => (
        <SearchInput
          key={size}
          inputSize={size}
          value={size === "md" ? value : undefined}
          onChange={size === "md" ? (e) => setValue(e.target.value) : undefined}
          onClear={size === "md" ? () => setValue('') : undefined}
          placeholder={`${size} search`}
        />
      ))}
    </div>
  );
}

const menuItems = ["Australia", "Austria", "Azerbaijan", "Argentina", "Armenia"];

function MenuDemo() {
  const [open, setOpen] = useState(true);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [selected, setSelected] = useState('');

  const filtered = menuItems.filter((item) =>
    item.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs font-medium text-muted uppercase tracking-wide">Interactive</p>
      <div className="relative">
        <SearchInput
          inputSize="md"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); setActiveIndex(0); }}
          onClear={() => { setQuery(''); setSelected(''); setOpen(true); }}
          placeholder="Search countries..."
        />
        <MenuList open={open} onClose={() => setOpen(false)}>
          {filtered.length === 0 ? (
            <MenuEmpty message={`No countries match "${query}"`} />
          ) : (
            filtered.map((item, i) => (
              <MenuItem
                key={item}
                active={i === activeIndex}
                selected={item === selected}
                onMouseEnter={() => setActiveIndex(i)}
                onClick={() => { setSelected(item); setQuery(item); setOpen(false); }}
              >
                {item}
              </MenuItem>
            ))
          )}
        </MenuList>
      </div>
      {selected && <p className="text-sm text-muted">Selected: <span className="text-foreground font-medium">{selected}</span></p>}

      <p className="text-xs font-medium text-muted uppercase tracking-wide">States</p>
      <div className="flex gap-4">
        <div className="relative flex-1">
          <p className="text-xs text-muted mb-1">With items</p>
          <MenuList open={true} className="relative mt-0">
            <MenuItem>Default item</MenuItem>
            <MenuItem active>Active item</MenuItem>
            <MenuItem selected>Selected item</MenuItem>
          </MenuList>
        </div>
        <div className="relative flex-1">
          <p className="text-xs text-muted mb-1">Empty state</p>
          <MenuList open={true} className="relative mt-0">
            <MenuEmpty />
          </MenuList>
        </div>
      </div>
    </div>
  );
}

export default function ComponentsPage() {
  return (
    <div className="flex flex-col gap-4 p-8" >
        {components.map(({label, component}) => (
          <Container key={label}>
            <h3 className="font-medium zinc-600">{label}</h3>
            {component}
          </Container>
        ))}
        <Container>
          <h3 className="font-medium zinc-600">SearchInput</h3>
          <SearchInputDemo />
        </Container>
        <Container>
          <h3 className="font-medium zinc-600">Menu</h3>
          <MenuDemo />
        </Container>
    </div>
  )
}
