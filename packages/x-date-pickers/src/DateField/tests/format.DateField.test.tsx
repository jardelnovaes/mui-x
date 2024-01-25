import * as React from 'react';
import {
  expectInputPlaceholder,
  expectInputValue,
  getTextbox,
  describeAdapters,
} from 'test/utils/pickers';
import { DateField } from '@mui/x-date-pickers/DateField';

describeAdapters('<DateField /> - Format', DateField, ({ render, adapter }) => {
  it('should support escaped characters in start separator', () => {
    const { start: startChar, end: endChar } = adapter.escapedCharacters;
    // For Day.js: "[Escaped] YYYY"
    const { setProps } = render(
      <DateField format={`${startChar}Escaped${endChar} ${adapter.formats.year}`} />,
    );
    const input = getTextbox();
    expectInputPlaceholder(input, 'Escaped YYYY');

    setProps({ value: adapter.date(new Date(2019, 0, 1)) });
    expectInputValue(input, 'Escaped 2019');
  });

  it('should support escaped characters between sections separator', () => {
    const { start: startChar, end: endChar } = adapter.escapedCharacters;
    // For Day.js: "MMMM [Escaped] YYYY"
    const { setProps } = render(
      <DateField
        format={`${adapter.formats.month} ${startChar}Escaped${endChar} ${adapter.formats.year}`}
      />,
    );
    const input = getTextbox();
    expectInputPlaceholder(input, 'MMMM Escaped YYYY');

    setProps({ value: adapter.date(new Date(2019, 0, 1)) });
    expectInputValue(input, 'January Escaped 2019');
  });

  it('should support nested escaped characters', function test() {
    const { start: startChar, end: endChar } = adapter.escapedCharacters;
    // If your start character and end character are equal
    // Then you can't have nested escaped characters
    if (startChar === endChar) {
      this.skip();
    }

    // For Day.js: "MMMM [Escaped[] YYYY"
    const { setProps } = render(
      <DateField
        format={`${adapter.formats.month} ${startChar}Escaped ${startChar}${endChar} ${adapter.formats.year}`}
      />,
    );
    const input = getTextbox();
    expectInputPlaceholder(input, 'MMMM Escaped [ YYYY');

    setProps({ value: adapter.date(new Date(2019, 0, 1)) });
    expectInputValue(input, 'January Escaped [ 2019');
  });

  it('should support several escaped parts', function test() {
    const { start: startChar, end: endChar } = adapter.escapedCharacters;

    // For Day.js: "[Escaped] MMMM [Escaped] YYYY"
    const { setProps } = render(
      <DateField
        format={`${startChar}Escaped${endChar} ${adapter.formats.month} ${startChar}Escaped${endChar} ${adapter.formats.year}`}
      />,
    );
    const input = getTextbox();
    expectInputPlaceholder(input, 'Escaped MMMM Escaped YYYY');

    setProps({ value: adapter.date(new Date(2019, 0, 1)) });
    expectInputValue(input, 'Escaped January Escaped 2019');
  });

  it('should add spaces around `/` when `formatDensity = "spacious"`', () => {
    const { setProps } = render(<DateField formatDensity="spacious" />);
    const input = getTextbox();
    expectInputPlaceholder(input, 'MM / DD / YYYY');

    setProps({ value: adapter.date(new Date(2019, 0, 1)) });
    expectInputValue(input, '01 / 01 / 2019');
  });

  it('should add spaces around `.` when `formatDensity = "spacious"`', () => {
    const { setProps } = render(
      <DateField
        formatDensity="spacious"
        format={adapter.expandFormat(adapter.formats.keyboardDate).replace(/\//g, '.')}
      />,
    );
    const input = getTextbox();
    expectInputPlaceholder(input, 'MM . DD . YYYY');

    setProps({ value: adapter.date(new Date(2019, 0, 1)) });
    expectInputValue(input, '01 . 01 . 2019');
  });

  it('should add spaces around `-` when `formatDensity = "spacious"`', () => {
    const { setProps } = render(
      <DateField
        formatDensity="spacious"
        format={adapter.expandFormat(adapter.formats.keyboardDate).replace(/\//g, '-')}
      />,
    );
    const input = getTextbox();
    expectInputPlaceholder(input, 'MM - DD - YYYY');

    setProps({ value: adapter.date(new Date(2019, 0, 1)) });
    expectInputValue(input, '01 - 01 - 2019');
  });
});
