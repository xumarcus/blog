---
title: NUS COM1 Printing
date: '2021-09-08'
tags: ['nus', 'casual']
draft: false
summary: How to make use of free quota
images: []
layout: PostLayout
---

As of today, you can print using COM1 printers on Windows laptops (I guess it's using SAMBA protocol). Printing on Mac/Linux however is unintuitive. The top Google result dates from 2017 and does not seem to work. It doesn't work either if you use Lemmark drivers instead of generic drivers. The official documentation was last updated in March 2021 (as of now, Sep 2021) so it was supposed to work, except it doesn't. It's possible that it works on Intel Macs but not M1 Macs, which I didn't test. In any case though, printing through `sunfire` seems much simpler, especially when there's no technical support from NUS. I'll shamelessly reference the script from Aaron Choo's [article](https://medium.com/@aaroncql/printing-via-sunfire-for-nus-soc-students-a879ce381630) for reference.

```bash
# Copy a local file to Sunfire
scp input.pdf MYSOC_USERNAME@sunfire.comp.nus.edu.sg:

# Login to Sunfire
ssh MYSOC_USERNAME@sunfire.comp.nus.edu.sg

# Convert PDF to PS file (Can do in Sunfire)
pdftops input.pdf

# Print via Sunfire
lpr -Ppsts input.ps

# Multiple copies
lpr -Ppsts -# 2 input.ps

# Options
-o number-up=N          Specify that input pages should be printed N-up (1, 2, 4, 6, 9, and 16 are supported)
-o sides=one-sided      Specify 1-sided printing
-o sides=two-sided-long-edge
                        Specify 2-sided portrait printing
-o sides=two-sided-short-edge
                        Specify 2-sided landscape printing

# Convert PS file to 2 pages per sheet
psnup -2up input.ps output.ps
```

The article linked explains everything in greater detail. Anyway, note the following:

- 2nd argument of `scp` should end with a colon (`:`), otherwise the command exits copying `input.pdf` to a local file `MYSOC_USERNAME@sunfire.comp.nus.edu.sg` without warning.
- When you `ssh`, use your `MYSOC_USERNAME` which might not be the same as your `NUSNET_ID` (e0123456).
- The printer emits a page showing your quota for every print job. There's 50 pages per month, with 50 pages overdraft.
