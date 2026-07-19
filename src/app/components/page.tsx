'use client';

import { ReactNode, useState } from 'react';
import { Banner, Container, Button, Typography, Input, SearchInput, MenuList, MenuItem, MenuEmpty, LoadingSkeleton, Image, InfoRow } from '@/components'
import useCombobox from '@/hooks/useCombobox'
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
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState('');

  const filtered = menuItems.filter((item) =>
    item.toLowerCase().includes(query.toLowerCase())
  );

  const combobox = useCombobox({
    count: filtered.length,
    onSelect: (index) => {
      setSelected(filtered[index]);
      setQuery(filtered[index]);
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs font-medium text-muted uppercase tracking-wide">Interactive (useCombobox)</p>
      <div className="relative">
        <SearchInput
          inputSize="md"
          value={query}
          onChange={(e) => { setQuery(e.target.value); combobox.handleOpen(); }}
          onClear={() => { setQuery(''); setSelected(''); combobox.handleOpen(); }}
          placeholder="Search countries... (try arrow keys)"
          {...combobox.getInputProps()}
        />
        <MenuList open={combobox.isOpen} onClose={combobox.handleClose} {...combobox.getMenuProps()}>
          {filtered.length === 0 ? (
            <MenuEmpty message={`No countries match "${query}"`} />
          ) : (
            filtered.map((item, i) => (
              <MenuItem
                key={item}
                active={i === combobox.activeIndex}
                selected={item === selected}
                {...combobox.getItemProps(i)}
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
        <Container>
          <h3 className="font-medium zinc-600">LoadingSkeleton</h3>
          <div className="flex flex-col gap-3">
            <p className="text-xs font-medium text-muted uppercase tracking-wide">Shapes</p>
            <div className="flex gap-3 items-center">
              <LoadingSkeleton width="2.5rem" height="2.5rem" rounded="full" />
              <div className="flex flex-col gap-1.5 flex-1">
                <LoadingSkeleton width="60%" height="0.75rem" />
                <LoadingSkeleton width="40%" height="0.75rem" />
              </div>
            </div>
            <p className="text-xs font-medium text-muted uppercase tracking-wide">Card skeleton</p>
            <div className="flex gap-3">
              <LoadingSkeleton width="6.75rem" height="4.5rem" rounded="sm" />
              <div className="flex flex-col gap-1.5 flex-1 py-1">
                <LoadingSkeleton width="70%" height="0.75rem" />
                <LoadingSkeleton width="50%" height="0.75rem" />
                <LoadingSkeleton width="40%" height="0.75rem" />
              </div>
            </div>
          </div>
        </Container>
        <Container>
          <h3 className="font-medium zinc-600">Image</h3>
          <div className="flex flex-col gap-3">
            <p className="text-xs font-medium text-muted uppercase tracking-wide">Aspect ratios</p>
            <div className="flex gap-3 items-start">
              <div className="flex flex-col gap-1 items-center">
                <Image src="https://flagcdn.com/w320/ph.png" alt="Philippines" aspect="3/2" width={112} height={75} className="rounded-sm" />
                <span className="text-xs text-muted">3:2</span>
              </div>
              <div className="flex flex-col gap-1 items-center">
                <Image src="https://flagcdn.com/w320/jp.png" alt="Japan" aspect="4/3" width={112} height={84} className="rounded-sm" />
                <span className="text-xs text-muted">4:3</span>
              </div>
              <div className="flex flex-col gap-1 items-center">
                <Image src="https://flagcdn.com/w320/au.png" alt="Australia" aspect="16/9" width={112} height={63} className="rounded-sm" />
                <span className="text-xs text-muted">16:9</span>
              </div>
              <div className="flex flex-col gap-1 items-center">
                <Image src="https://flagcdn.com/w320/ch.png" alt="Switzerland" aspect="1/1" width={80} height={80} className="rounded-sm" />
                <span className="text-xs text-muted">1:1</span>
              </div>
            </div>
          </div>
        </Container>
        <Container>
          <h3 className="font-medium zinc-600">InfoRow</h3>
          <div className="flex flex-col gap-2">
            <InfoRow label="Official Name" value="Republic of the Philippines" />
            <InfoRow label="Currency" value="Philippine peso (₱)" />
            <InfoRow label="Drives on" value="Right" />
          </div>
        </Container>
    </div>
  )
}
