; Pinball (World) NES ROM Disassembly
; author: ninespaces
; see also: https://docs.google.com/spreadsheets/d/1FpXARxK_NXZuHxc539eZ7Anj7WUZ-AqbQbU_5aSd8LA/edit?usp=sharing

; PRG CRC32 checksum: 91d33e3c
; CHR CRC32 checksum: f2a53b3d
; Overall CRC32 checksum: 035dc2e9
; Code base address: $c000

.setcpu "6502x"
.segment "HEADER"

.byte "NES", $1a                 ; Magic string that always begins an iNES header
.byte $01                        ; Number of 16KB PRG-ROM banks
.byte $01                        ; Number of 8KB CHR-ROM banks
.byte $00                        ; Control bits 1
.byte $00                        ; Control bits 2
.byte $00                        ; Number of 8KB PRG-RAM banks
.byte $00                        ; Video format NTSC/PAL

APU_DMC_RAW = $4011
APU_FRAME = $4017
APU_NOISE_HI = $400F
APU_NOISE_LO = $400E
APU_NOISE_VOL = $400C
APU_PL1_HI = $4003
APU_PL1_LO = $4002
APU_PL1_SWEEP = $4001
APU_PL1_VOL = $4000
APU_PL2_HI = $4007
APU_PL2_LO = $4006
APU_PL2_SWEEP = $4005
APU_PL2_VOL = $4004
APU_SND_CHN = $4015
APU_TRI_LINEAR = $4008
JOYPAD1 = $4016
JOYPAD2 = $4017
OAM_ADDR = $2003
OAM_DMA = $4014
PPU_ADDR = $2006
PPU_CTRL = $2000
PPU_DATA = $2007
PPU_MASK = $2001
PPU_SCROLL = $2005
PPU_STATUS = $2002

_var_0000_indexed = $0000
_var_0001_indexed = $0001
_var_0002 = $0002
_var_0003 = $0003
_var_0004 = $0004
_var_0005 = $0005
_var_0006_indexed = $0006
_var_0007_indexed = $0007
_var_0008 = $0008
_var_0009 = $0009
_var_000a_indexed = $000A
_var_000b_indexed = $000B
_var_000c = $000C
_var_000d = $000D
_var_000e = $000E
_var_000f = $000F
_var_0010 = $0010
_var_0011 = $0011
_var_0012 = $0012
_var_0013 = $0013
_var_0014 = $0014
_var_0015 = $0015
_var_0016 = $0016
_var_0017 = $0017
_var_0018 = $0018
_var_0019 = $0019
_var_001a = $001A
_var_001b = $001B
_var_001c = $001C
_var_001d = $001D
_var_001e = $001E
_var_001f = $001F
_var_0020 = $0020
_var_0021 = $0021
_var_0022 = $0022
_var_0023 = $0023
_var_0024 = $0024
_var_0025 = $0025
_var_0026 = $0026
_var_0027 = $0027
_var_0028 = $0028
_var_0029 = $0029
_var_002a_indexed = $002A
_var_002b = $002B
_var_002c = $002C
_var_002e_indexed = $002E
_var_0030 = $0030
_var_0031 = $0031
_var_0032 = $0032
_var_0033 = $0033
_var_0034 = $0034
_var_0035 = $0035
_var_0036 = $0036
_var_0037 = $0037
_var_0038 = $0038
_var_0039 = $0039
_var_003a = $003A
_var_003b = $003B
_var_003c = $003C
_var_003d = $003D
_var_003e = $003E
_var_003f = $003F
_var_0040 = $0040
_var_0041 = $0041
_var_0042 = $0042
_var_0043 = $0043
_var_0044 = $0044
_var_004a_indexed = $004A
_var_006a_indexed = $006A
_var_0077_indexed = $0077
_var_007a_indexed = $007A
_var_0084_indexed = $0084
_var_008a_indexed = $008A
_var_009a_indexed = $009A
_var_00b2 = $00B2
_var_00b3 = $00B3
_var_00b4 = $00B4
_var_00b5 = $00B5
_var_00b6 = $00B6
_var_00b7 = $00B7
_var_00b8 = $00B8
_var_00b9 = $00B9
_var_00ba = $00BA
_var_00bb = $00BB
_var_00bc = $00BC
_var_00bd = $00BD
_var_player1or2 = $00BE
_var_tableUpperOrLower = $00BF
_var_00c0_indexed = $00C0
_var_00c1 = $00C1
_var_00c2_indexed = $00C2
_var_00c3 = $00C3
_var_00c4 = $00C4
_var_00c5 = $00C5
_var_00c6 = $00C6
_var_00c7_indexed = $00C7
_var_00c9_indexed = $00C9
_var_00cc = $00CC
_var_00cd = $00CD
_var_00ce = $00CE
_var_00cf = $00CF
_var_upperTablePills = $00D0
_var_00d1 = $00D1
_var_00d2 = $00D2
_var_00d3 = $00D3
_var_00d4 = $00D4
_var_00d5 = $00D5
_var_00d6 = $00D6
_var_00d7 = $00D7
_var_00d8_indexed = $00D8
_var_00db_indexed = $00DB
_var_00dc = $00DC
_var_00dd_indexed = $00DD
_var_00de = $00DE
_var_00df_indexed = $00DF
_var_00e0 = $00E0
_var_00e1_indexed = $00E1
_var_00e2 = $00E2
_var_00e3 = $00E3
_var_00e4 = $00E4
_var_00e6 = $00E6
_var_00e7 = $00E7
_var_00e8 = $00E8
_var_00e9 = $00E9
_var_00ea = $00EA
_var_00eb = $00EB
_var_00ec = $00EC
_var_00ed = $00ED
_var_00ee = $00EE
_var_00ef = $00EF
_var_00f0 = $00F0
_var_00f1_indexed = $00F1
_var_00f2 = $00F2
_var_00f3 = $00F3
_var_00f4 = $00F4
_var_00f5 = $00F5
_var_00f6 = $00F6
_var_00f7 = $00F7
_var_00f8 = $00F8
_var_00f9 = $00F9
_var_00fa = $00FA
_var_00fb_indexed = $00FB
_var_00fd = $00FD
_var_00fe = $00FE
_var_00ff = $00FF
_var_1pScore5Bytes = $0100
_var_1pScoreTenThousands = $0101
_var_010a_indexed = $010A
_var_010c_indexed = $010C
_var_TopScore5Bytes = $010E
_var_upperTableTileSpinners = $0118
_var_011b = $011B
_var_011c_indexed = $011C
_var_011d = $011D
_var_011e = $011E
_var_011f_indexed = $011F
_var_0120_indexed = $0120
_var_0122 = $0122
_var_0123 = $0123
_var_0124 = $0124
_var_0125 = $0125
_var_0126 = $0126
_var_0127_indexed = $0127
_var_lowerTableCards = $0128
_var_0129 = $0129
_var_012a = $012A
_var_012b = $012B
_var_012c = $012C
_var_012d_indexed = $012D
_var_upperTableFlags = $0130
_var_lowerTableFlags = $0131
_var_upperTableSealBounces = $0132
_var_0133 = $0133
_var_0134 = $0134
_var_0135 = $0135
_var_0136 = $0136
_var_0137 = $0137
_var_0138 = $0138
_var_0139 = $0139
_var_013b = $013B
_var_013f = $013F
_var_0142 = $0142
_var_0143 = $0143
_var_0144 = $0144
_var_0145 = $0145
_var_0146 = $0146
_var_0147 = $0147
_var_0149 = $0149
_var_014a = $014A
_var_014b = $014B
_var_014c = $014C
_var_014d = $014D
_var_014e = $014E
_var_014f = $014F
_var_0150 = $0150
_var_0151_indexed = $0151
_var_0152 = $0152
_var_0153 = $0153
_var_0154 = $0154
_var_0155 = $0155
_var_0156 = $0156
_var_0200_indexed = $0200
_var_0201_indexed = $0201
_var_022c_indexed = $022C
_var_022d = $022D
_var_022e = $022E
_var_022f = $022F
_var_0230 = $0230
_var_0234 = $0234
_var_0238 = $0238
_var_023d_indexed = $023D
_var_023e_indexed = $023E
_var_0251_indexed = $0251
_var_0252_indexed = $0252
_var_0264_indexed = $0264
_var_0265_indexed = $0265
_var_0266_indexed = $0266
_var_0267_indexed = $0267
_var_0268_indexed = $0268
_var_0269_indexed = $0269
_var_026a_indexed = $026A
_var_027c_indexed = $027C
_var_0285_indexed = $0285
_var_028c_indexed = $028C
_var_0290_indexed = $0290
_var_029e_indexed = $029E
_var_02ac_indexed = $02AC
_var_02b2_indexed = $02B2
_var_02b3_indexed = $02B3
_var_02b7_indexed = $02B7
_var_02c5 = $02C5
_var_02c9_indexed = $02C9
_var_02cc = $02CC
_var_02cd_indexed = $02CD
_var_02dd = $02DD
_var_02fc_indexed = $02FC
_var_02fd = $02FD
_var_0300_indexed = $0300
_var_0400_indexed = $0400
_var_04fa_indexed = $04FA
_var_04fb_indexed = $04FB
_var_0500_indexed = $0500
_var_0600_indexed = $0600
_var_0620_indexed = $0620
_var_0621_indexed = $0621
_var_0622_indexed = $0622
_var_062e_indexed = $062E
_var_06e0_indexed = $06E0
_var_06ee_indexed = $06EE
_var_06ef_indexed = $06EF
_var_06f0_indexed = $06F0
_var_06f1_indexed = $06F1
_var_0731_indexed = $0731
_var_0732_indexed = $0732
_var_0751_indexed = $0751
_var_0752_indexed = $0752
_var_07f0 = $07F0
_var_07f1 = $07F1
_var_07f2 = $07F2
_var_07f3 = $07F3
_var_07f5 = $07F5
_var_07f6 = $07F6
_var_bea6 = $BEA6

.segment "CODE"

Reset:
  cld                            ; $C000  D8
  sei                            ; $C001  78

_label_c002:
  lda PPU_STATUS                 ; $C002  AD 02 20
  bpl _label_c002                ; $C005  10 FB
  ldx #$FF                       ; $C007  A2 FF
  txs                            ; $C009  9A
  lda #$00                       ; $C00A  A9 00
  tax                            ; $C00C  AA

_label_c00d:
  sta z:_var_0000_indexed,X      ; $C00D  95 00
  inx                            ; $C00F  E8
  bne _label_c00d                ; $C010  D0 FB
  tay                            ; $C012  A8
  sta PPU_CTRL                   ; $C013  8D 00 20
  sta PPU_MASK                   ; $C016  8D 01 20
  ldx #$57                       ; $C019  A2 57
  lda #$00                       ; $C01B  A9 00

_label_c01d:
  sta a:_var_1pScore5Bytes,X      ; $C01D  9D 00 01
  dex                            ; $C020  CA
  bpl _label_c01d                ; $C021  10 FA

_label_c023:
  lda z:_var_00e6                ; $C023  A5 E6
  sta z:_var_0006_indexed        ; $C025  85 06
  sta z:_var_0008                ; $C027  85 08
  jsr _func_dcdd                 ; $C029  20 DD DC
  ldx z:_var_00e6                ; $C02C  A6 E6
  lda z:_var_0006_indexed        ; $C02E  A5 06
  sta a:_var_0300_indexed,X      ; $C030  9D 00 03
  inc z:_var_00e6                ; $C033  E6 E6
  bne _label_c023                ; $C035  D0 EC
  lda #$1E                       ; $C037  A9 1E
  sta z:_var_0001_indexed        ; $C039  85 01

_label_c03b:
  jsr _func_c27f                 ; $C03B  20 7F C2
  lda #$10                       ; $C03E  A9 10
  sta z:_var_0000_indexed        ; $C040  85 00
  lda z:_var_0004                ; $C042  A5 04
  bne _label_c058                ; $C044  D0 12
  ldx #$0D                       ; $C046  A2 0D
  lda #$00                       ; $C048  A9 00

_label_c04a:
  sta a:_var_1pScore5Bytes,X      ; $C04A  9D 00 01
  dex                            ; $C04D  CA
  bpl _label_c04a                ; $C04E  10 FA
  lda #$03                       ; $C050  A9 03
  sta a:_var_0151_indexed        ; $C052  8D 51 01
  sta a:_var_0152                ; $C055  8D 52 01

_label_c058:
  jsr _func_e09b                 ; $C058  20 9B E0
  jsr _func_ed06                 ; $C05B  20 06 ED
  jsr _func_edf2                 ; $C05E  20 F2 ED
  lda z:_var_00bd                ; $C061  A5 BD
  beq _label_c06c                ; $C063  F0 07
  inc z:_var_player1or2                ; $C065  E6 BE
  jsr _func_edf2                 ; $C067  20 F2 ED
  dec z:_var_player1or2                ; $C06A  C6 BE

_label_c06c:
  lda #$90                       ; $C06C  A9 90
  sta z:_var_0000_indexed        ; $C06E  85 00
  lda #$00                       ; $C070  A9 00
  ldx #$0E                       ; $C072  A2 0E

_label_c074:
  sta a:_var_0127_indexed,X      ; $C074  9D 27 01
  dex                            ; $C077  CA
  bpl _label_c074                ; $C078  10 FA
  sta a:_var_014d                ; $C07A  8D 4D 01
  sta z:_var_00c7_indexed        ; $C07D  85 C7
  sta z:$C8                      ; $C07F  85 C8
  tax                            ; $C081  AA
  lda #$08                       ; $C082  A9 08
  sta z:_var_upperTablePills                ; $C084  85 D0
  stx z:_var_001c                ; $C086  86 1C
  stx z:_var_00cf                ; $C088  86 CF
  inx                            ; $C08A  E8
  jsr _func_cce9                 ; $C08B  20 E9 CC
  lda #$46                       ; $C08E  A9 46
  jsr _func_ee4d                 ; $C090  20 4D EE
  lda a:_var_014a                ; $C093  AD 4A 01
  bne _label_c09b                ; $C096  D0 03
  jsr _func_e497                 ; $C098  20 97 E4

_label_c09b:
  lda z:_var_0004                ; $C09B  A5 04
  bne _label_c0ae                ; $C09D  D0 0F
  lda #$DC                       ; $C09F  A9 DC
  sta a:_var_0135                ; $C0A1  8D 35 01

_label_c0a4:
  lda a:_var_0135                ; $C0A4  AD 35 01
  bne _label_c0a4                ; $C0A7  D0 FB
  ldx z:_var_player1or2                ; $C0A9  A6 BE
  dec a:_var_0151_indexed,X      ; $C0AB  DE 51 01

_label_c0ae:
  lda #$05                       ; $C0AE  A9 05
  sta z:_var_001e                ; $C0B0  85 1E
  lda #$50                       ; $C0B2  A9 50
  sta z:_var_00b7                ; $C0B4  85 B7
  lda #$80                       ; $C0B6  A9 80
  sta z:_var_00b8                ; $C0B8  85 B8
  bne _label_c0d3                ; $C0BA  D0 17

_label_c0bc:
  jsr _func_c181                 ; $C0BC  20 81 C1

_label_c0bf:
  jsr _func_e02c                 ; $C0BF  20 2C E0
  jsr _func_e046                 ; $C0C2  20 46 E0
  and #$10                       ; $C0C5  29 10
  bne _label_c0cc                ; $C0C7  D0 03
  jmp _label_c0bf                ; $C0C9  4C BF C0

_label_c0cc:
  lda #$04                       ; $C0CC  A9 04
  sta z:_var_00fd                ; $C0CE  85 FD
  jsr _func_c181                 ; $C0D0  20 81 C1

_label_c0d3:
  inc z:_var_0005                ; $C0D3  E6 05
  lda #$00                       ; $C0D5  A9 00
  sta z:_var_0002                ; $C0D7  85 02
  jsr _func_e049                 ; $C0D9  20 49 E0
  jsr _func_cba7                 ; $C0DC  20 A7 CB
  jsr _func_e40e                 ; $C0DF  20 0E E4
  lda z:_var_001d                ; $C0E2  A5 1D
  beq _label_c0e9                ; $C0E4  F0 03
  jmp _label_c18f                ; $C0E6  4C 8F C1

_label_c0e9:
  jsr _func_ec80                 ; $C0E9  20 80 EC
  lda z:_var_tableUpperOrLower                ; $C0EC  A5 BF
  cmp #$02                       ; $C0EE  C9 02
  beq _label_c10e                ; $C0F0  F0 1C
  lda a:_var_014a                ; $C0F2  AD 4A 01
  beq _label_c10b                ; $C0F5  F0 14
  lda z:_var_0004                ; $C0F7  A5 04
  bne _label_c10b                ; $C0F9  D0 10
  ldx z:_var_player1or2                ; $C0FB  A6 BE
  lda a:_var_010c_indexed,X      ; $C0FD  BD 0C 01
  bne _label_c10e                ; $C100  D0 0C
  inc a:_var_010c_indexed,X      ; $C102  FE 0C 01
  jsr _func_e0fd                 ; $C105  20 FD E0
  jmp _label_c10e                ; $C108  4C 0E C1

_label_c10b:
  jsr _func_e497                 ; $C10B  20 97 E4

_label_c10e:
  lda z:_var_tableUpperOrLower                ; $C10E  A5 BF
  bne _label_c121                ; $C110  D0 0F
  jsr _func_e68f                 ; $C112  20 8F E6
  jsr _func_ec8d                 ; $C115  20 8D EC
  jsr _func_f06f                 ; $C118  20 6F F0
  jsr _func_f0df                 ; $C11B  20 DF F0
  jsr _func_f44b                 ; $C11E  20 4B F4

_label_c121:
  ldx z:_var_tableUpperOrLower                ; $C121  A6 BF
  dex                            ; $C123  CA
  bne _label_c12f                ; $C124  D0 09
  jsr _func_f138                 ; $C126  20 38 F1
  jsr _func_f3e8                 ; $C129  20 E8 F3
  jsr _func_f41e                 ; $C12C  20 1E F4

_label_c12f:
  lda z:_var_tableUpperOrLower                ; $C12F  A5 BF
  cmp #$02                       ; $C131  C9 02
  bne _label_c145                ; $C133  D0 10
  jsr _func_e7ac                 ; $C135  20 AC E7
  lda a:_var_011e                ; $C138  AD 1E 01
  bmi _label_c18c                ; $C13B  30 4F
  beq _label_c142                ; $C13D  F0 03
  jsr _func_ea2f                 ; $C13F  20 2F EA

_label_c142:
  jsr _func_f226                 ; $C142  20 26 F2

_label_c145:
  lda z:_var_0002                ; $C145  A5 02
  beq _label_c145                ; $C147  F0 FC
  jsr _func_e046                 ; $C149  20 46 E0
  and #$30                       ; $C14C  29 30
  beq _label_c157                ; $C14E  F0 07
  lda z:_var_0004                ; $C150  A5 04
  beq _label_c157                ; $C152  F0 03
  jmp _label_c03b                ; $C154  4C 3B C0

_label_c157:
  lda z:_var_00b6                ; $C157  A5 B6
  and #$10                       ; $C159  29 10
  bne _label_c160                ; $C15B  D0 03
  jmp _label_c0d3                ; $C15D  4C D3 C0

_label_c160:
  lda #$04                       ; $C160  A9 04
  sta z:_var_00fd                ; $C162  85 FD
  jsr _func_e48c                 ; $C164  20 8C E4
  jmp _label_c0bc                ; $C167  4C BC C0

; data
.byte $42, $59, $20, $53, $2e, $4d, $41, $54, $53, $55, $4f, $4b, $41, $20, $26, $20 ; $C16A
.byte $53, $2e, $49, $57, $41, $54, $41 ; $C17A

_func_c181:
  jsr _func_e02c                 ; $C181  20 2C E0
  jsr _func_e046                 ; $C184  20 46 E0
  and #$10                       ; $C187  29 10
  bne _func_c181                 ; $C189  D0 F6
  rts                            ; $C18B  60

_label_c18c:
  jsr _func_e023                 ; $C18C  20 23 E0

_label_c18f:
  jsr _func_e48c                 ; $C18F  20 8C E4
  lda z:_var_0004                ; $C192  A5 04
  bne _label_c1ea                ; $C194  D0 54
  ldx z:_var_player1or2                ; $C196  A6 BE
  lda a:_var_0151_indexed,X      ; $C198  BD 51 01
  bne _label_c1c5                ; $C19B  D0 28
  jsr _func_e023                 ; $C19D  20 23 E0
  jsr _func_e403                 ; $C1A0  20 03 E4
  lda #$8A                       ; $C1A3  A9 8A
  sta PPU_CTRL                   ; $C1A5  8D 00 20
  inc a:_var_014c                ; $C1A8  EE 4C 01
  inc a:_var_014d                ; $C1AB  EE 4D 01
  lda #$30                       ; $C1AE  A9 30
  sta a:_var_0155                ; $C1B0  8D 55 01
  jsr _func_e023                 ; $C1B3  20 23 E0
  dec a:_var_014c                ; $C1B6  CE 4C 01
  lda z:_var_00bd                ; $C1B9  A5 BD
  beq _label_c1ea                ; $C1BB  F0 2D
  lda a:_var_0151_indexed        ; $C1BD  AD 51 01
  ora a:_var_0152                ; $C1C0  0D 52 01
  beq _label_c1ea                ; $C1C3  F0 25

_label_c1c5:
  lda z:_var_00bd                ; $C1C5  A5 BD
  beq _label_c1e7                ; $C1C7  F0 1E
  lda z:_var_player1or2                ; $C1C9  A5 BE
  eor #$01                       ; $C1CB  49 01
  tay                            ; $C1CD  A8
  lda a:_var_0151_indexed,Y      ; $C1CE  B9 51 01
  beq _label_c1e7                ; $C1D1  F0 14
  lda a:_var_014d                ; $C1D3  AD 4D 01
  bne _label_c1dd                ; $C1D6  D0 05
  ldx #$3C                       ; $C1D8  A2 3C
  jsr _func_e025                 ; $C1DA  20 25 E0

_label_c1dd:
  jsr _func_e2a6                 ; $C1DD  20 A6 E2
  ldx #$1E                       ; $C1E0  A2 1E
  jsr _func_e025                 ; $C1E2  20 25 E0
  sty z:_var_player1or2                ; $C1E5  84 BE

_label_c1e7:
  jmp _label_c06c                ; $C1E7  4C 6C C0

_label_c1ea:
  jmp _label_c03b                ; $C1EA  4C 3B C0

NMI:
  pha                            ; $C1ED  48
  txa                            ; $C1EE  8A
  pha                            ; $C1EF  48
  tya                            ; $C1F0  98
  pha                            ; $C1F1  48
  lda #$00                       ; $C1F2  A9 00
  sta OAM_ADDR                   ; $C1F4  8D 03 20
  lda #$02                       ; $C1F7  A9 02
  sta OAM_DMA                    ; $C1F9  8D 14 40
  lda a:_var_0153                ; $C1FC  AD 53 01
  beq _label_c20b                ; $C1FF  F0 0A
  lda z:_var_0001_indexed        ; $C201  A5 01
  sta PPU_MASK                   ; $C203  8D 01 20
  lda #$00                       ; $C206  A9 00
  sta a:_var_0153                ; $C208  8D 53 01

_label_c20b:
  lda z:_var_0003                ; $C20B  A5 03
  bne _label_c25a                ; $C20D  D0 4B
  lda z:_var_tableUpperOrLower                ; $C20F  A5 BF
  cmp #$02                       ; $C211  C9 02
  beq _label_c231                ; $C213  F0 1C
  ldy a:_var_0155                ; $C215  AC 55 01
  beq _label_c231                ; $C218  F0 17
  ldx #$3F                       ; $C21A  A2 3F
  lda #$00                       ; $C21C  A9 00
  jsr _func_e0ef                 ; $C21E  20 EF E0
  ldx #$0F                       ; $C221  A2 0F

_label_c223:
  lda a:_data_e3b2_indexed,X     ; $C223  BD B2 E3
  cmp #$12                       ; $C226  C9 12
  bne _label_c22b                ; $C228  D0 01
  tya                            ; $C22A  98

_label_c22b:
  sta PPU_DATA                   ; $C22B  8D 07 20
  dex                            ; $C22E  CA
  bpl _label_c223                ; $C22F  10 F2

_label_c231:
  lda a:_var_014c                ; $C231  AD 4C 01
  bne _label_c26f                ; $C234  D0 39
  jsr _func_eded                 ; $C236  20 ED ED
  jsr _func_edb0                 ; $C239  20 B0 ED
  jsr _func_ebf9                 ; $C23C  20 F9 EB
  jsr _func_e5b6                 ; $C23F  20 B6 E5
  jsr _func_f321                 ; $C242  20 21 F3
  jsr _func_efd3                 ; $C245  20 D3 EF
  jsr _func_eb9d                 ; $C248  20 9D EB
  jsr _func_ef28                 ; $C24B  20 28 EF
  jsr _func_f3b9                 ; $C24E  20 B9 F3
  lda z:_var_tableUpperOrLower                ; $C251  A5 BF
  cmp #$02                       ; $C253  C9 02
  bne _label_c25a                ; $C255  D0 03
  jsr _func_f2f0                 ; $C257  20 F0 F2

_label_c25a:
  lda #$00                       ; $C25A  A9 00
  sta PPU_SCROLL                 ; $C25C  8D 05 20
  sta PPU_SCROLL                 ; $C25F  8D 05 20
  jsr _func_fff7                 ; $C262  20 F7 FF
  lda #$01                       ; $C265  A9 01
  sta z:_var_0002                ; $C267  85 02
  pla                            ; $C269  68
  tay                            ; $C26A  A8
  pla                            ; $C26B  68
  tax                            ; $C26C  AA
  pla                            ; $C26D  68
  rti                            ; $C26E  40

_label_c26f:
  clc                            ; $C26F  18
  lda z:_var_player1or2                ; $C270  A5 BE
  adc #$8B                       ; $C272  69 8B
  tay                            ; $C274  A8
  ldx #$29                       ; $C275  A2 29
  lda #$93                       ; $C277  A9 93
  jsr _func_e0f6                 ; $C279  20 F6 E0
  jmp _label_c25a                ; $C27C  4C 5A C2

_func_c27f:
  inc z:_var_0003                ; $C27F  E6 03
  jsr _func_e2a6                 ; $C281  20 A6 E2
  lda #$00                       ; $C284  A9 00
  sta z:_var_player1or2                ; $C286  85 BE
  sta z:_var_0004                ; $C288  85 04
  jsr _func_e046                 ; $C28A  20 46 E0
  and #$10                       ; $C28D  29 10
  beq _label_c294                ; $C28F  F0 03
  jmp _label_c3b7                ; $C291  4C B7 C3

_label_c294:
  jsr _func_e403                 ; $C294  20 03 E4
  lda #$08                       ; $C297  A9 08
  sta PPU_CTRL                   ; $C299  8D 00 20
  sta z:_var_0000_indexed        ; $C29C  85 00
  lda #$6B                       ; $C29E  A9 6B
  sta z:_var_00e1_indexed        ; $C2A0  85 E1
  lda #$C5                       ; $C2A2  A9 C5
  sta z:_var_00e2                ; $C2A4  85 E2
  ldy #$13                       ; $C2A6  A0 13
  jsr _func_e293                 ; $C2A8  20 93 E2
  ldx #$20                       ; $C2AB  A2 20
  lda #$00                       ; $C2AD  A9 00
  jsr _func_c3e0                 ; $C2AF  20 E0 C3
  ldx #$28                       ; $C2B2  A2 28
  lda #$00                       ; $C2B4  A9 00
  jsr _func_c3e0                 ; $C2B6  20 E0 C3
  ldx #$00                       ; $C2B9  A2 00
  ldy #$00                       ; $C2BB  A0 00

_label_c2bd:
  lda a:_data_c50b_indexed,X     ; $C2BD  BD 0B C5
  sta PPU_ADDR                   ; $C2C0  8D 06 20
  inx                            ; $C2C3  E8
  lda a:_data_c50b_indexed,X     ; $C2C4  BD 0B C5
  sta PPU_ADDR                   ; $C2C7  8D 06 20
  inx                            ; $C2CA  E8
  lda #$0E                       ; $C2CB  A9 0E
  sta z:_var_00e6                ; $C2CD  85 E6

_label_c2cf:
  lda a:_data_c400_indexed,Y     ; $C2CF  B9 00 C4
  sta PPU_DATA                   ; $C2D2  8D 07 20
  iny                            ; $C2D5  C8
  dec z:_var_00e6                ; $C2D6  C6 E6
  bne _label_c2cf                ; $C2D8  D0 F5
  cpx #$0C                       ; $C2DA  E0 0C
  bne _label_c2bd                ; $C2DC  D0 DF

_label_c2de:
  lda a:_data_c50b_indexed,X     ; $C2DE  BD 0B C5
  sta PPU_ADDR                   ; $C2E1  8D 06 20
  inx                            ; $C2E4  E8
  lda a:_data_c50b_indexed,X     ; $C2E5  BD 0B C5
  sta PPU_ADDR                   ; $C2E8  8D 06 20
  inx                            ; $C2EB  E8
  lda #$13                       ; $C2EC  A9 13
  sta z:_var_00e6                ; $C2EE  85 E6

_label_c2f0:
  lda a:_data_c400_indexed,Y     ; $C2F0  B9 00 C4
  sta PPU_DATA                   ; $C2F3  8D 07 20
  iny                            ; $C2F6  C8
  dec z:_var_00e6                ; $C2F7  C6 E6
  bne _label_c2f0                ; $C2F9  D0 F5
  cpx #$18                       ; $C2FB  E0 18
  bne _label_c2de                ; $C2FD  D0 DF
  ldx #$00                       ; $C2FF  A2 00

_label_c301:
  lda a:_data_c523_indexed,X     ; $C301  BD 23 C5
  sta PPU_ADDR                   ; $C304  8D 06 20
  lda a:_data_c524_indexed,X     ; $C307  BD 24 C5
  sta PPU_ADDR                   ; $C30A  8D 06 20
  lda a:_data_c503_indexed,X     ; $C30D  BD 03 C5
  sta PPU_DATA                   ; $C310  8D 07 20
  ldy #$00                       ; $C313  A0 00

_label_c315:
  lda a:_data_c4f6_indexed,Y     ; $C315  B9 F6 C4
  sta PPU_DATA                   ; $C318  8D 07 20
  iny                            ; $C31B  C8
  cpy #$0D                       ; $C31C  C0 0D
  bne _label_c315                ; $C31E  D0 F5
  lda a:_data_c504_indexed,X     ; $C320  BD 04 C5
  sta PPU_DATA                   ; $C323  8D 07 20
  inx                            ; $C326  E8
  inx                            ; $C327  E8
  cpx #$08                       ; $C328  E0 08
  bne _label_c301                ; $C32A  D0 D5
  ldy #$00                       ; $C32C  A0 00

_label_c32e:
  ldx a:_data_c4c6_indexed,Y     ; $C32E  BE C6 C4
  beq _label_c34b                ; $C331  F0 18
  iny                            ; $C333  C8
  lda a:_data_c4c6_indexed,Y     ; $C334  B9 C6 C4
  jsr _func_e0ef                 ; $C337  20 EF E0
  iny                            ; $C33A  C8
  ldx a:_data_c4c6_indexed,Y     ; $C33B  BE C6 C4
  iny                            ; $C33E  C8

_label_c33f:
  lda a:_data_c4c6_indexed,Y     ; $C33F  B9 C6 C4
  iny                            ; $C342  C8
  sta PPU_DATA                   ; $C343  8D 07 20
  dex                            ; $C346  CA
  bne _label_c33f                ; $C347  D0 F6  unconditional branch pattern (complementary branches)
  beq _label_c32e                ; $C349  F0 E3

_label_c34b:
  ldx #$02                       ; $C34B  A2 02

_label_c34d:
  lda a:_data_c57f_indexed,X     ; $C34D  BD 7F C5
  sta a:_var_0201_indexed,X      ; $C350  9D 01 02
  dex                            ; $C353  CA
  bpl _label_c34d                ; $C354  10 F7
  ldx a:_var_014f                ; $C356  AE 4F 01
  lda a:_data_c582_indexed,X     ; $C359  BD 82 C5
  sta a:_var_0200_indexed        ; $C35C  8D 00 02
  jsr _func_e278                 ; $C35F  20 78 E2
  inc z:_var_00b9                ; $C362  E6 B9
  lda #$78                       ; $C364  A9 78
  sta a:_var_014e                ; $C366  8D 4E 01
  lda a:_var_0150                ; $C369  AD 50 01
  inc a:_var_0150                ; $C36C  EE 50 01
  and #$03                       ; $C36F  29 03
  bne _label_c37c                ; $C371  D0 09
  lda #$0F                       ; $C373  A9 0F
  sta APU_SND_CHN                ; $C375  8D 15 40
  lda #$02                       ; $C378  A9 02
  sta z:_var_00fd                ; $C37A  85 FD

_label_c37c:
  jsr _func_e02c                 ; $C37C  20 2C E0
  inc z:_var_0005                ; $C37F  E6 05
  lda z:_var_0005                ; $C381  A5 05
  and #$03                       ; $C383  29 03
  bne _label_c38c                ; $C385  D0 05
  dec a:_var_014e                ; $C387  CE 4E 01
  beq _label_c3d3                ; $C38A  F0 47

_label_c38c:
  jsr _func_e046                 ; $C38C  20 46 E0
  and #$20                       ; $C38F  29 20
  cmp z:_var_00b9                ; $C391  C5 B9
  beq _label_c3b1                ; $C393  F0 1C
  ldy z:_var_00b9                ; $C395  A4 B9
  sta z:_var_00b9                ; $C397  85 B9
  bne _label_c3b1                ; $C399  D0 16
  ldx a:_var_014f                ; $C39B  AE 4F 01
  inx                            ; $C39E  E8
  txa                            ; $C39F  8A
  and #$03                       ; $C3A0  29 03
  sta a:_var_014f                ; $C3A2  8D 4F 01
  tax                            ; $C3A5  AA
  lda a:_data_c582_indexed,X     ; $C3A6  BD 82 C5
  sta a:_var_0200_indexed        ; $C3A9  8D 00 02
  lda #$3C                       ; $C3AC  A9 3C
  sta a:_var_014e                ; $C3AE  8D 4E 01

_label_c3b1:
  lda z:_var_00b6                ; $C3B1  A5 B6
  and #$10                       ; $C3B3  29 10
  beq _label_c37c                ; $C3B5  F0 C5

_label_c3b7:
  lda a:_var_014f                ; $C3B7  AD 4F 01
  lsr a                          ; $C3BA  4A
  sta z:_var_00bd                ; $C3BB  85 BD
  lda #$00                       ; $C3BD  A9 00
  rol a                          ; $C3BF  2A
  sta z:_var_00bc                ; $C3C0  85 BC
  lda #$0F                       ; $C3C2  A9 0F
  sta APU_SND_CHN                ; $C3C4  8D 15 40

_label_c3c7:
  lda #$00                       ; $C3C7  A9 00
  sta z:_var_0003                ; $C3C9  85 03
  jmp _func_e2a6                 ; $C3CB  4C A6 E2

_label_c3ce:
  inc a:_var_014e                ; $C3CE  EE 4E 01
  bne _label_c37c                ; $C3D1  D0 A9

_label_c3d3:
  lda z:_var_00f6                ; $C3D3  A5 F6
  bne _label_c3ce                ; $C3D5  D0 F7
  inc z:_var_0004                ; $C3D7  E6 04
  ldx #$00                       ; $C3D9  A2 00
  stx APU_SND_CHN                ; $C3DB  8E 15 40
  beq _label_c3c7                ; $C3DE  F0 E7

_func_c3e0:
  jsr _func_e0ef                 ; $C3E0  20 EF E0
  lda #$B9                       ; $C3E3  A9 B9
  ldy #$03                       ; $C3E5  A0 03
  ldx #$C0                       ; $C3E7  A2 C0

_label_c3e9:
  sta PPU_DATA                   ; $C3E9  8D 07 20
  dex                            ; $C3EC  CA
  bne _label_c3e9                ; $C3ED  D0 FA
  dey                            ; $C3EF  88
  bpl _label_c3e9                ; $C3F0  10 F7
  ldx #$00                       ; $C3F2  A2 00

_label_c3f4:
  lda a:_data_c52b_indexed,X     ; $C3F4  BD 2B C5
  sta PPU_DATA                   ; $C3F7  8D 07 20
  inx                            ; $C3FA  E8
  cpx #$40                       ; $C3FB  E0 40
  bne _label_c3f4                ; $C3FD  D0 F5
  rts                            ; $C3FF  60

_data_c400_indexed:
.byte $3a, $3c, $3c, $3c, $3b, $b9, $3a, $3b, $b9, $3a, $3b, $b9, $3a, $3b, $3c, $3c ; $C400
.byte $3d, $3c, $3c, $b9, $3c, $3c, $b9, $3c, $3c, $b9, $3c, $3c, $3c, $3c, $3e, $3c ; $C410
.byte $3c, $b9, $3c, $3c, $b9, $3c, $3c, $56, $3c, $3c, $3c, $3c, $3c, $3c, $4f, $b9 ; $C420
.byte $3c, $3c, $b9, $3c, $3c, $57, $3c, $3c, $3c, $3c, $b9, $b9, $b9, $b9, $3c, $3c ; $C430
.byte $b9, $3c, $3c, $b9, $3c, $3c, $3f, $4f, $b9, $b9, $b9, $b9, $3f, $4f, $b9, $3f ; $C440
.byte $4f, $b9, $3f, $4f, $3a, $3c, $3c, $3c, $3b, $b9, $3a, $3c, $3c, $3c, $3b, $b9 ; $C450
.byte $3a, $3b, $b9, $b9, $3a, $3b, $b9, $3c, $3c, $ae, $3c, $3c, $b9, $3c, $3c, $3d ; $C460
.byte $3c, $3c, $b9, $3c, $3c, $b9, $b9, $3c, $3c, $b9, $3c, $3c, $3c, $3c, $4f, $b9 ; $C470
.byte $3c, $3c, $b9, $3c, $3c, $b9, $3c, $3c, $b9, $b9, $3c, $3c, $b9, $3c, $3c, $3d ; $C480
.byte $3c, $3b, $b9, $3c, $3c, $3c, $3c, $3c, $b9, $3c, $3c, $b9, $b9, $3c, $3c, $b9 ; $C490
.byte $3c, $3c, $3e, $3c, $3c, $b9, $3c, $3c, $b9, $3c, $3c, $b9, $3c, $3c, $b9, $b9 ; $C4A0
.byte $3c, $3c, $b9, $3f, $3c, $3c, $3c, $4f, $b9, $3f, $4f, $b9, $3f, $4f, $b9, $3f ; $C4B0
.byte $3c, $ad, $b9, $3f, $3c, $ad ; $C4C0

_data_c4c6_indexed:
.byte $23, $65, $16, $6f, $8b, $8f, $8e, $8d, $b9, $69, $66, $69, $6d, $64, $69, $63 ; $C4C6
.byte $6a, $b9, $62, $6a, $ee, $67, $6d, $63, $ef, $29, $cb, $0a, $65, $60, $68, $64 ; $C4D6
.byte $b9, $b9, $6a, $7a, $64, $6c, $29, $8c, $06, $6b, $67, $60, $6e, $64, $6c, $00 ; $C4E6

_data_c4f6_indexed:
.byte $b9, $6b, $67, $60, $6e, $64, $6c, $b9, $65, $60, $68, $64, $b9 ; $C4F6

_data_c503_indexed:
.byte $8b                        ; $C503

_data_c504_indexed:
.byte $60, $8b, $61, $8c, $60, $8c, $61 ; $C504

_data_c50b_indexed:
.byte $20, $64, $20, $84, $20, $a4, $20, $c4, $20, $e4, $21, $04, $21, $49, $21, $69 ; $C50B
.byte $21, $89, $21, $a9, $21, $c9, $21, $e9 ; $C51B

_data_c523_indexed:
.byte $22                        ; $C523

_data_c524_indexed:
.byte $49, $22, $89, $22, $c9, $23, $09 ; $C524

_data_c52b_indexed:
.byte $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00 ; $C52B
.byte $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00 ; $C53B
.byte $00, $00, $50, $50, $50, $50, $00, $00, $00, $00, $a5, $a5, $a5, $a5, $00, $00 ; $C54B
.byte $00, $00, $0a, $0a, $0a, $0a, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00 ; $C55B
.byte $0f, $0f, $27, $0f, $0f, $0f, $0f, $0f, $0f, $0f, $12, $0f, $0f, $0f, $22, $0f ; $C56B
.byte $0f, $25, $30, $0f         ; $C57B

_data_c57f_indexed:
.byte $f5, $00, $38              ; $C57F

_data_c582_indexed:
.byte $8f, $9f, $af, $bf, $14, $31, $14, $31, $14, $31, $31, $31, $32, $33, $34, $0a ; $C582
.byte $35, $36, $37, $38, $31, $31, $31, $39, $3a, $05, $24, $73, $68, $07, $24, $3b ; $C592
.byte $3c, $31, $3d, $3e, $24, $3f, $40, $24, $72, $68, $41, $42, $72, $68, $24, $43 ; $C5A2
.byte $44, $45, $46, $24, $47, $48, $4a, $24, $4b, $4c, $4d, $4e, $41, $42, $24, $24 ; $C5B2
.byte $41, $42, $43, $4c, $31, $31, $4d, $50, $24, $51, $52, $24, $53, $31, $31, $4d ; $C5C2
.byte $54, $28, $29, $28, $29, $58, $4c, $04, $31, $59, $24, $5a, $54, $24, $5b, $24 ; $C5D2
.byte $68, $55, $54, $9e, $9f, $9e, $9f, $58, $60, $61, $34, $36, $64, $65, $66, $67 ; $C5E2
.byte $54, $24, $5b, $31, $55, $69, $08, $24, $72, $68, $24, $6c, $6d, $24, $6e, $24 ; $C5F2
.byte $6f, $55, $69, $09, $24, $3f, $46, $24, $74, $75, $24, $76, $24, $77, $78, $03 ; $C602
.byte $24, $7f, $80, $81, $82, $03, $24, $79, $78, $24, $7b, $75, $24, $7c, $24, $7d ; $C612
.byte $7e, $03, $24, $83, $84, $85, $86, $03, $24, $58, $78, $24, $7b, $75, $24, $4d ; $C622
.byte $6e, $05, $24, $87, $88, $89, $8a, $03, $24, $58, $78, $24, $7b, $75, $24, $31 ; $C632
.byte $76, $0c, $24, $58, $78, $24, $7b, $75, $24, $31, $7c, $0c, $24, $67, $7e, $24 ; $C642
.byte $7b, $75, $24, $31, $78, $8b, $0e, $24, $8c, $75, $24, $31, $78, $8b, $0d, $24 ; $C652
.byte $8d, $8e, $75, $24, $31, $78, $8b, $0d, $24, $8f, $31, $75, $24, $31, $78, $8b ; $C662
.byte $0d, $24, $5b, $31, $75, $24, $55, $69, $0e, $24, $79, $91, $75, $24, $69, $24 ; $C672
.byte $0f, $24, $92, $75, $24, $24, $24, $4f, $03, $24, $93, $94, $95, $96, $97, $98 ; $C682
.byte $03, $24, $4f, $24, $99, $75, $24, $24, $9a, $9b, $4e, $0a, $24, $43, $9b, $9c ; $C692
.byte $9d, $75, $24, $24, $7b, $31, $78, $0a, $24, $5b, $03, $31, $75, $24, $24, $7b ; $C6A2
.byte $55, $69, $0a, $24, $79, $91, $31, $31, $75, $24, $24, $7b, $78, $0c, $24, $5b ; $C6B2
.byte $31, $31, $75, $24, $24, $7b, $78, $0c, $24, $5b, $31, $31, $75, $24, $24, $7b ; $C6C2
.byte $78, $0c, $24, $5b, $31, $31, $75, $24, $24, $7b, $78, $0c, $24, $5b, $31, $31 ; $C6D2
.byte $75, $24, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00 ; $C6E2
.byte $00, $00, $00, $00, $00, $00, $f0, $c0, $30, $00, $00, $00, $00, $00, $ff, $00 ; $C6F2
.byte $33, $00, $00, $00, $88, $00, $00, $00, $00, $00, $00, $00, $00, $88, $aa, $aa ; $C702
.byte $00, $00, $00, $00, $00, $00, $f0, $00, $00, $00, $00, $00, $00, $00, $00, $00 ; $C712
.byte $00, $00                   ; $C722

_data_c724_indexed:
.byte $28, $58, $01, $57, $2f, $58, $01, $52, $37, $58, $01, $4e, $40, $58, $01, $4c ; $C724
.byte $49, $58, $01, $4c, $52, $58, $01, $4d, $5a, $58, $01, $50, $62, $58, $01, $53 ; $C734
.byte $8f, $80, $00, $78, $8f, $80, $40, $80, $97, $59, $00, $78, $97, $59, $40, $80 ; $C744
.byte $8f, $81, $00, $88, $8f, $82, $00, $90, $97, $84, $00, $88, $97, $83, $00, $90 ; $C754
.byte $8f, $82, $40, $98, $8f, $81, $40, $a0, $97, $84, $00, $98, $97, $83, $00, $a0 ; $C764
.byte $ab, $54, $02, $c8, $ab, $54, $42, $d0, $b3, $55, $02, $c8, $b3, $55, $42, $d0 ; $C774
.byte $3f, $f1, $03, $60, $f0, $f0, $02, $68, $65, $b9, $41, $74, $6f, $7d, $40, $74 ; $C784
.byte $77, $7e, $40, $78, $77, $7f, $40, $70, $65, $b9, $01, $a4, $6f, $7d, $00, $a4 ; $C794
.byte $77, $7e, $00, $a0, $77, $7f, $00, $a8, $f0, $59, $02, $ac, $5f, $ff, $00, $ca ; $C7A4
.byte $89, $39, $01, $88, $89, $39, $41, $90 ; $C7B4

_data_c7bc_indexed:
.byte $4e, $ce, $02, $6d, $18, $b0, $00, $60, $18, $b1, $00, $68, $20, $b2, $00, $5f ; $C7BC
.byte $20, $b3, $00, $67, $18, $b6, $00, $c0, $20, $b7, $00, $c0, $f0, $b8, $00, $b8 ; $C7CC
.byte $f0, $b8, $80, $b8, $7e, $ba, $00, $c1, $7e, $bb, $00, $c9, $86, $bc, $00, $c9 ; $C7DC
.byte $24, $a0, $78, $0c, $24, $5b, $31, $31, $6d, $24, $24, $a0, $78, $0c, $24, $6c ; $C7EC
.byte $31, $31, $6d, $24, $24, $7d, $7e, $0c, $24, $a4, $60, $a5, $6d, $24, $6e, $03 ; $C7FC
.byte $24, $2a, $2b, $2a, $2b, $2a, $2b, $2a, $2b, $2a, $2b, $03, $24, $ae, $6d, $24 ; $C80C
.byte $76, $03, $24, $2c, $2d, $2c, $2d, $2c, $2d, $2c, $2d, $2c, $2d, $03, $24, $af ; $C81C
.byte $6d, $24, $7c, $03, $24, $2e, $2f, $2e, $2f, $2e, $2f, $2e, $2f, $2e, $2f, $03 ; $C82C
.byte $24, $b6, $6d, $24, $78, $24, $24, $28, $29, $28, $29, $28, $29, $28, $29, $28 ; $C83C
.byte $29, $28, $29, $24, $24, $5b, $6d, $24, $78, $24, $24, $9e, $9f, $9e, $9f, $9e ; $C84C
.byte $9f, $9e, $9f, $9e, $9f, $9e, $9f, $05, $24, $78, $13, $24, $78, $03, $24, $7f ; $C85C
.byte $80, $81, $82, $24, $24, $7f, $80, $81, $82, $06, $24, $78, $03, $24, $83, $84 ; $C86C
.byte $85, $86, $24, $24, $83, $84, $85, $86, $03, $24, $5b, $6d, $24, $78, $03, $24 ; $C87C
.byte $87, $88, $89, $8a, $24, $24, $87, $88, $89, $8a, $03, $24, $5b, $6d, $24, $78 ; $C88C
.byte $10, $24, $5b, $6d, $24, $78, $06, $24, $7f, $80, $81, $82, $06, $24, $5b, $6d ; $C89C
.byte $24, $4d, $4e, $05, $24, $83, $84, $85, $86, $05, $24, $43, $4c, $6d, $24, $55 ; $C8AC
.byte $69, $05, $24, $87, $88, $89, $8a, $05, $24, $79, $91, $6d, $24, $69, $10, $24 ; $C8BC
.byte $79, $6d, $24, $54, $10, $24, $58, $6d, $24, $54, $ba, $24, $bb, $be, $08, $24 ; $C8CC
.byte $bc, $c1, $24, $bd, $58, $6d, $24, $54, $ba, $24, $bf, $c2, $08, $24, $c0, $c4 ; $C8DC
.byte $24, $bd, $58, $6d, $24, $54, $ba, $24, $c3, $c9, $08, $24, $c5, $cb, $24, $bd ; $C8EC
.byte $58, $c6, $c7, $54, $c8, $d0, $24, $ca, $08, $24, $cc, $24, $d3, $cd, $58, $ce ; $C8FC
.byte $cf, $54, $24, $d1, $27, $0a, $24, $d5, $d2, $24, $58, $ce, $cf, $54, $24, $24 ; $C90C
.byte $d4, $26, $08, $24, $90, $25, $24, $24, $58, $ce, $cf, $4e, $10, $24, $7a, $ce ; $C91C
.byte $cf, $4d, $4e, $0e, $24, $43, $1f, $ce, $cf, $31, $4d, $4e, $0c, $24, $43, $4c ; $C92C
.byte $78, $02, $31, $31, $31, $4d, $4e, $0a, $24, $43, $4c, $31, $78, $02, $31, $03 ; $C93C
.byte $31, $4d, $4e, $08, $24, $43, $4c, $02, $31, $78, $02, $31, $04, $31, $4d, $4e ; $C94C
.byte $06, $24, $43, $4c, $03, $31, $78, $02, $31, $00, $00, $00, $f0, $f0, $f0, $00 ; $C95C
.byte $00, $00, $00, $00, $0f, $0f, $0f, $00, $00, $00, $00, $00, $ff, $ff, $ff, $33 ; $C96C
.byte $00, $00, $00, $00, $00, $aa, $00, $00, $00, $00, $00, $00, $30, $00, $c0, $00 ; $C97C
.byte $00, $00, $00, $00, $03, $00, $0c, $44, $11, $00, $00, $00, $00, $ff, $00, $44 ; $C98C
.byte $11, $00, $00, $00, $00, $00, $00, $00, $00, $8f, $af, $00, $78, $97, $5c, $00 ; $C99C
.byte $78, $8f, $af, $00, $8c, $97, $5c, $00, $8c, $8f, $af, $00, $a0, $97, $5c, $00 ; $C9AC
.byte $a0, $f0, $af, $00, $9c, $17, $54, $02, $c8, $17, $54, $42, $d0, $1f, $55, $02 ; $C9BC
.byte $c8, $1f, $55, $42, $d0    ; $C9CC

_data_c9d1_indexed:
.byte $37, $70, $01, $50, $3f, $70, $01, $50, $47, $70, $01, $50, $4f, $70, $01, $50 ; $C9D1
.byte $57, $70, $01, $50, $5f, $70, $01, $50, $67, $70, $01, $50, $37, $71, $01, $58 ; $C9E1
.byte $3f, $72, $01, $58, $47, $73, $01, $58, $4f, $74, $01, $58, $57, $75, $01, $58 ; $C9F1
.byte $5f, $76, $01, $58, $67, $77, $01, $58, $37, $5a, $03, $cc, $37, $5b, $03, $d4 ; $CA01
.byte $3f, $5a, $03, $cc, $3f, $5b, $03, $d4, $47, $5a, $03, $cc, $47, $5b, $03, $d4 ; $CA11
.byte $f0, $5e, $42, $4f, $f0, $5f, $42, $47, $f0, $5e, $02, $c9, $f0, $5f, $02, $d1 ; $CA21
.byte $97, $ff, $00, $5a, $97, $ff, $40, $be, $fe, $14, $31, $03, $31, $0e, $20, $03 ; $CA31
.byte $31, $03, $31, $0e, $24, $03, $31, $03, $31, $0e, $21, $03, $31, $03, $31, $d8 ; $CA41
.byte $0c, $d9, $da, $03, $31, $03, $31, $d8, $0c, $24, $da, $03, $31, $03, $31, $d8 ; $CA51
.byte $0c, $24, $da, $03, $31, $03, $31, $d8, $03, $db, $06, $24, $03, $db, $da, $03 ; $CA61
.byte $31, $31, $55, $dc, $0e, $24, $a4, $91, $31, $31, $a1, $10, $24, $6c, $31, $55 ; $CA71
.byte $dc, $05, $24, $dd, $de, $e1, $e2, $e1, $e2, $05, $24, $a4, $31, $a1, $06, $24 ; $CA81
.byte $df, $e0, $e3, $e4, $f1, $f2, $06, $24, $6c, $dc, $24, $7f, $80, $81, $82, $24 ; $CA91
.byte $dd, $de, $e1, $e2, $e1, $e2, $24, $7f, $80, $81, $82, $24, $a4, $24, $24, $83 ; $CAA1
.byte $84, $85, $86, $24, $df, $e0, $e3, $e4, $f1, $f2, $24, $83, $84, $85, $86, $24 ; $CAB1
.byte $24, $e5, $24, $87, $88, $89, $8a, $24, $dd, $de, $e1, $e2, $e1, $e2, $24, $87 ; $CAC1
.byte $88, $89, $8a, $24, $e8, $e9, $06, $24, $df, $e0, $e3, $e4, $f1, $f2, $06, $24 ; $CAD1
.byte $ec, $4d, $e5, $05, $24, $dd, $de, $e1, $e2, $e1, $e2, $05, $24, $e8, $4c, $31 ; $CAE1
.byte $e9, $05, $24, $df, $e0, $e3, $e4, $f1, $f2, $05, $24, $ec, $31, $31, $4d, $e5 ; $CAF1
.byte $0e, $24, $e8, $4c, $31, $60, $60, $ea, $0e, $24, $eb, $60, $60, $14, $24, $24 ; $CB01
.byte $f3, $b7, $b8, $0c, $24, $b7, $b8, $b9, $24, $14, $24, $05, $d9, $0a, $24, $05 ; $CB11
.byte $d9, $14, $24, $14, $24, $24, $24, $10, $ed, $24, $24, $24, $24, $10, $ed, $24 ; $CB21
.byte $24, $24, $24, $10, $ed, $24, $24, $24, $24, $10, $ed, $24, $24, $00, $00, $88 ; $CB31
.byte $aa, $aa, $aa, $aa, $00, $00, $00, $88, $aa, $aa, $aa, $aa, $00, $00, $00, $00 ; $CB41
.byte $00, $20, $10, $00, $00, $00, $00, $44, $55, $22, $55, $55, $00, $00, $00, $00 ; $CB51
.byte $00, $02, $01, $00, $00, $00, $00, $08, $02, $00, $00, $0a, $00, $00, $00, $44 ; $CB61
.byte $55, $55, $55, $55, $00, $00, $00, $44, $55, $55, $55, $55, $00 ; $CB71

_data_cb7e_indexed:
.byte $37, $36, $00, $80, $37, $36, $40, $88, $37, $36, $00, $90, $37, $36, $40, $98 ; $CB7E
.byte $37, $36, $00, $a0, $37, $36, $40, $a8, $99, $54, $02, $90, $99, $54, $42, $98 ; $CB8E
.byte $a1, $55, $02, $90, $a1, $55, $42, $98, $fe ; $CB9E

_func_cba7:
  lda z:_var_0004                ; $CBA7  A5 04
  beq _label_cbaf                ; $CBA9  F0 04
  lda #$04                       ; $CBAB  A9 04
  bne _label_cbb4                ; $CBAD  D0 05

_label_cbaf:
  lda z:_var_00bc                ; $CBAF  A5 BC
  clc                            ; $CBB1  18
  adc #$03                       ; $CBB2  69 03

_label_cbb4:
  sta z:_var_001d                ; $CBB4  85 1D

_label_cbb6:
  lda #$00                       ; $CBB6  A9 00
  sta z:_var_001c                ; $CBB8  85 1C

_label_cbba:
  lda z:_var_00d2                ; $CBBA  A5 D2
  bpl _label_cbc4                ; $CBBC  10 06
  jsr _func_cc78                 ; $CBBE  20 78 CC
  jmp _label_cc5d                ; $CBC1  4C 5D CC

_label_cbc4:
  jsr _func_de30                 ; $CBC4  20 30 DE
  jsr _func_de6c                 ; $CBC7  20 6C DE
  jsr _func_dbb6                 ; $CBCA  20 B6 DB
  ldx #$02                       ; $CBCD  A2 02

_label_cbcf:
  asl z:_var_000a_indexed        ; $CBCF  06 0A
  rol z:_var_000b_indexed        ; $CBD1  26 0B
  asl z:_var_000c                ; $CBD3  06 0C
  rol z:_var_000d                ; $CBD5  26 0D
  dex                            ; $CBD7  CA
  bne _label_cbcf                ; $CBD8  D0 F5
  jsr _func_dcc9                 ; $CBDA  20 C9 DC
  lda z:_var_0009                ; $CBDD  A5 09
  cmp #$08                       ; $CBDF  C9 08
  bcs _label_cbe9                ; $CBE1  B0 06
  dec z:_var_tableUpperOrLower                ; $CBE3  C6 BF
  lda #$E9                       ; $CBE5  A9 E9
  bne _label_cc01                ; $CBE7  D0 18

_label_cbe9:
  cmp #$F1                       ; $CBE9  C9 F1
  bcc _label_cc06                ; $CBEB  90 19
  lda z:_var_tableUpperOrLower                ; $CBED  A5 BF
  beq _label_cbfd                ; $CBEF  F0 0C
  cmp #$02                       ; $CBF1  C9 02
  beq _label_cbf6                ; $CBF3  F0 01
  rts                            ; $CBF5  60

_label_cbf6:
  ldx #$00                       ; $CBF6  A2 00
  stx z:_var_001d                ; $CBF8  86 1D
  jmp _func_cce9                 ; $CBFA  4C E9 CC

_label_cbfd:
  inc z:_var_tableUpperOrLower                ; $CBFD  E6 BF
  lda #$08                       ; $CBFF  A9 08

_label_cc01:
  sta z:_var_0009                ; $CC01  85 09
  jsr _func_e0fd                 ; $CC03  20 FD E0

_label_cc06:
  jsr _func_de41                 ; $CC06  20 41 DE
  lda #$00                       ; $CC09  A9 00
  sta z:_var_001f                ; $CC0B  85 1F
  lda z:_var_0007_indexed        ; $CC0D  A5 07
  sta z:_var_0020                ; $CC0F  85 20
  lda z:_var_0009                ; $CC11  A5 09
  sta z:_var_0021                ; $CC13  85 21

_label_cc15:
  jsr _func_ce6c                 ; $CC15  20 6C CE

_label_cc18:
  dec z:_var_0026                ; $CC18  C6 26
  bmi _label_cc3a                ; $CC1A  30 1E
  jsr _func_cfec                 ; $CC1C  20 EC CF
  bcc _label_cc35                ; $CC1F  90 14
  lda z:_var_001f                ; $CC21  A5 1F
  bne _label_cc3a                ; $CC23  D0 15
  lda z:_var_0007_indexed        ; $CC25  A5 07
  cmp z:_var_0020                ; $CC27  C5 20
  bne _label_cc15                ; $CC29  D0 EA
  lda z:_var_0009                ; $CC2B  A5 09
  cmp z:_var_0021                ; $CC2D  C5 21
  bne _label_cc15                ; $CC2F  D0 E4
  inc z:_var_001f                ; $CC31  E6 1F
  bne _label_cc15                ; $CC33  D0 E0

_label_cc35:
  jsr _func_d0ad                 ; $CC35  20 AD D0
  bcc _label_cc18                ; $CC38  90 DE

_label_cc3a:
  jsr _func_d4f0                 ; $CC3A  20 F0 D4
  jsr _func_cd34                 ; $CC3D  20 34 CD
  dec z:_var_001e                ; $CC40  C6 1E
  bne _label_cc5d                ; $CC42  D0 19
  lda #$05                       ; $CC44  A9 05
  sta z:_var_001e                ; $CC46  85 1E
  jsr _func_de6c                 ; $CC48  20 6C DE
  lda z:_var_000c                ; $CC4B  A5 0C
  clc                            ; $CC4D  18
  adc #$01                       ; $CC4E  69 01
  bmi _label_cc58                ; $CC50  30 06
  cmp #$40                       ; $CC52  C9 40
  bcc _label_cc58                ; $CC54  90 02
  lda #$3F                       ; $CC56  A9 3F

_label_cc58:
  sta z:_var_000c                ; $CC58  85 0C
  jsr _func_de7e                 ; $CC5A  20 7E DE

_label_cc5d:
  dec z:_var_001c                ; $CC5D  C6 1C
  bmi _label_cc64                ; $CC5F  30 03
  jmp _label_cbba                ; $CC61  4C BA CB

_label_cc64:
  jsr _func_cd02                 ; $CC64  20 02 CD
  lda z:_var_tableUpperOrLower                ; $CC67  A5 BF
  cmp #$02                       ; $CC69  C9 02
  beq _label_cc70                ; $CC6B  F0 03
  jsr _func_e609                 ; $CC6D  20 09 E6

_label_cc70:
  dec z:_var_001d                ; $CC70  C6 1D
  beq _label_cc77                ; $CC72  F0 03
  jmp _label_cbb6                ; $CC74  4C B6 CB

_label_cc77:
  rts                            ; $CC77  60

_func_cc78:
  lda z:_var_0024                ; $CC78  A5 24
  beq _label_cc7f                ; $CC7A  F0 03
  dec z:_var_0024                ; $CC7C  C6 24
  rts                            ; $CC7E  60

_label_cc7f:
  ldx z:_var_0023                ; $CC7F  A6 23
  lda a:_data_db94_indexed,X     ; $CC81  BD 94 DB
  bmi _label_cc8f                ; $CC84  30 09
  sta z:_var_001b                ; $CC86  85 1B
  lda a:_data_db95_indexed,X     ; $CC88  BD 95 DB
  sta z:_var_0024                ; $CC8B  85 24
  bne _label_ccb6                ; $CC8D  D0 27

_label_cc8f:
  cmp #$FF                       ; $CC8F  C9 FF
  beq _label_ccbb                ; $CC91  F0 28
  lda z:_var_00d2                ; $CC93  A5 D2
  and #$7F                       ; $CC95  29 7F
  tay                            ; $CC97  A8
  lda a:_data_dba8_indexed,Y     ; $CC98  B9 A8 DB
  cmp z:_var_tableUpperOrLower                ; $CC9B  C5 BF
  beq _label_ccb7                ; $CC9D  F0 18
  sta z:_var_tableUpperOrLower                ; $CC9F  85 BF
  tax                            ; $CCA1  AA

_label_cca2:
  lda a:_data_dbae_indexed,X     ; $CCA2  BD AE DB
  sta z:_var_0007_indexed        ; $CCA5  85 07
  lda a:_data_dbb2_indexed,X     ; $CCA7  BD B2 DB
  sta z:_var_0009                ; $CCAA  85 09
  jsr _func_de41                 ; $CCAC  20 41 DE
  lda #$32                       ; $CCAF  A9 32
  sta z:_var_0024                ; $CCB1  85 24
  jmp _func_e0fd                 ; $CCB3  4C FD E0

_label_ccb6:
  inx                            ; $CCB6  E8

_label_ccb7:
  inx                            ; $CCB7  E8
  stx z:_var_0023                ; $CCB8  86 23
  rts                            ; $CCBA  60

_label_ccbb:
  ldx z:_var_tableUpperOrLower                ; $CCBB  A6 BF
  cpx #$01                       ; $CCBD  E0 01
  beq _label_ccd3                ; $CCBF  F0 12
  lda #$C1                       ; $CCC1  A9 C1
  sta z:_var_0008                ; $CCC3  85 08
  ldx z:_var_tableUpperOrLower                ; $CCC5  A6 BF
  beq _label_ccd9                ; $CCC7  F0 10
  jsr _func_e3e2                 ; $CCC9  20 E2 E3
  tax                            ; $CCCC  AA
  bmi _label_ccd9                ; $CCCD  30 0A
  lda #$3F                       ; $CCCF  A9 3F
  bne _label_ccd9                ; $CCD1  D0 06

_label_ccd3:
  lda #$18                       ; $CCD3  A9 18
  sta z:_var_0008                ; $CCD5  85 08
  bne _label_ccdd                ; $CCD7  D0 04

_label_ccd9:
  ldx #$01                       ; $CCD9  A2 01
  stx z:_var_00fe                ; $CCDB  86 FE

_label_ccdd:
  sta z:_var_0006_indexed        ; $CCDD  85 06
  jsr _func_de75                 ; $CCDF  20 75 DE
  lda #$00                       ; $CCE2  A9 00
  sta z:_var_00d2                ; $CCE4  85 D2
  sta z:_var_0023                ; $CCE6  85 23
  rts                            ; $CCE8  60

_func_cce9:
  lda a:_data_dbaa_indexed,X     ; $CCE9  BD AA DB
  sta z:_var_tableUpperOrLower                ; $CCEC  85 BF
  ora #$80                       ; $CCEE  09 80
  sta z:_var_00d2                ; $CCF0  85 D2
  lda a:_data_dbac_indexed,X     ; $CCF2  BD AC DB
  tax                            ; $CCF5  AA
  inc z:_var_0022                ; $CCF6  E6 22
  lda #$0B                       ; $CCF8  A9 0B
  sta z:_var_0023                ; $CCFA  85 23
  lda #$04                       ; $CCFC  A9 04
  sta z:_var_001b                ; $CCFE  85 1B
  bne _label_cca2                ; $CD00  D0 A0

_func_cd02:
  lda #$00                       ; $CD02  A9 00
  sta z:_var_001c                ; $CD04  85 1C
  jsr _func_de30                 ; $CD06  20 30 DE
  ldx #$02                       ; $CD09  A2 02

_label_cd0b:
  lda z:_var_00cd                ; $CD0B  A5 CD
  and a:_data_d7dd_indexed,X     ; $CD0D  3D DD D7
  beq _label_cd30                ; $CD10  F0 1E
  lda z:_var_0007_indexed        ; $CD12  A5 07
  sec                            ; $CD14  38
  sbc a:_data_d9b1_indexed,X     ; $CD15  FD B1 D9
  cmp a:_data_d9b4_indexed,X     ; $CD18  DD B4 D9
  bcc _label_cd30                ; $CD1B  90 13
  lda a:_data_d9b7_indexed,X     ; $CD1D  BD B7 D9
  sta z:_var_00db_indexed        ; $CD20  85 DB
  lda a:_data_d9ba_indexed,X     ; $CD22  BD BA D9
  sta z:_var_00dc                ; $CD25  85 DC
  ldy #$00                       ; $CD27  A0 00
  txa                            ; $CD29  8A
  adc #$1F                       ; $CD2A  69 1F
  sta (_var_00db_indexed),Y      ; $CD2C  91 DB
  sty z:_var_00cd                ; $CD2E  84 CD

_label_cd30:
  dex                            ; $CD30  CA
  bpl _label_cd0b                ; $CD31  10 D8
  rts                            ; $CD33  60

_func_cd34:
  lda #$00                       ; $CD34  A9 00
  sta z:_var_0041                ; $CD36  85 41
  sta z:_var_0044                ; $CD38  85 44
  ldx z:_var_tableUpperOrLower                ; $CD3A  A6 BF
  lda a:_data_dae1_indexed,X     ; $CD3C  BD E1 DA
  sta z:_var_0042                ; $CD3F  85 42

_label_cd41:
  jsr _func_de30                 ; $CD41  20 30 DE
  ldx z:_var_0042                ; $CD44  A6 42

_label_cd46:
  lda a:_data_dae4_indexed,X     ; $CD46  BD E4 DA
  cmp #$FF                       ; $CD49  C9 FF
  beq _label_cd97                ; $CD4B  F0 4A
  lda z:_var_0009                ; $CD4D  A5 09
  cmp a:_data_dae4_indexed,X     ; $CD4F  DD E4 DA
  bcc _label_cd59                ; $CD52  90 05
  cmp a:_data_daf4_indexed,X     ; $CD54  DD F4 DA
  bcc _label_cd5e                ; $CD57  90 05

_label_cd59:
  inc z:_var_0041                ; $CD59  E6 41
  inx                            ; $CD5B  E8
  bne _label_cd46                ; $CD5C  D0 E8

_label_cd5e:
  stx z:_var_0042                ; $CD5E  86 42
  lda a:_data_db04_indexed,X     ; $CD60  BD 04 DB
  tax                            ; $CD63  AA
  ldy #$00                       ; $CD64  A0 00
  lda z:_var_0007_indexed        ; $CD66  A5 07

; checks which card is being revealed
_label_cd68:
  cmp a:_data_db14_indexed,X     ; $CD68  DD 14 DB
  bcc _label_cd71                ; $CD6B  90 04
  inx                            ; $CD6D  E8
  iny                            ; $CD6E  C8
  bne _label_cd68                ; $CD6F  D0 F7

_label_cd71:
  sty z:_var_0043                ; $CD71  84 43
  lda a:_data_db44_indexed,X     ; $CD73  BD 44 DB
  bne _label_cd7d                ; $CD76  D0 05
  ldx z:_var_0042                ; $CD78  A6 42
  jmp _label_cd59                ; $CD7A  4C 59 CD

_label_cd7d:
  tax                            ; $CD7D  AA
  dex                            ; $CD7E  CA
  lda a:_data_db74_indexed,X     ; $CD7F  BD 74 DB
  sta z:_var_00e4                ; $CD82  85 E4
  lda a:_data_db7e_indexed,X     ; $CD84  BD 7E DB
  sta z:$E5                      ; $CD87  85 E5
  lda #$4C                       ; $CD89  A9 4C
  sta z:_var_00e3                ; $CD8B  85 E3
  jsr a:_var_00e3                ; $CD8D  20 E3 00
  inc z:_var_0042                ; $CD90  E6 42
  inc z:_var_0041                ; $CD92  E6 41
  jmp _label_cd41                ; $CD94  4C 41 CD

_label_cd97:
  lda z:_var_0044                ; $CD97  A5 44
  sta z:_var_0022                ; $CD99  85 22
  rts                            ; $CD9B  60

_func_cd9c:
  inc z:_var_0044                ; $CD9C  E6 44
  lda z:_var_0022                ; $CD9E  A5 22
  beq _label_cda4                ; $CDA0  F0 02
  pla                            ; $CDA2  68
  pla                            ; $CDA3  68

; score (offset table $DB88) for upper table upper chutes (500,1000,500)
_label_cda4:
  rts                            ; $CDA4  60
  jsr _func_cd9c                 ; $CDA5  20 9C CD
  lda #$FF                       ; $CDA8  A9 FF
  sta z:_var_00d3                ; $CDAA  85 D3
  ldx z:_var_0043                ; $CDAC  A6 43
  dex                            ; $CDAE  CA
  lda a:_data_db88_indexed,X     ; $CDAF  BD 88 DB
  jmp _func_ee3d                 ; $CDB2  4C 3D EE

 ; score (offset 0x0A) for upper table upper left chute pills, $D0 tracks
 ldx #$08               ; $CDB5 A2 08
 lda $09                ; $CDB7 A5 09

_label_cdb9:
 cmp $DB8B,X            ; $CDB9 DD 8B DB
 bcs _label_cdc1              ; $CDBC B0 03
 dex                    ; $CDBE CA
 bpl _label_cdb9              ; $CDBF 10 F8

_label_cdc1:
 lda $D0                ; $CDC1 A5 D0
 and #$7F               ; $CDC3 29 7F
 sta $E3                ; $CDC5 85 E3
 cpx $E3                ; $CDC7 E4 E3
 bcs _label_cdd5              ; $CDC9 B0 0A
 txa                    ; $CDCB 8A
 ora #$80               ; $CDCC 09 80
 sta $D0                ; $CDCE 85 D0
 lda #$0A               ; $CDD0 A9 0A
 jmp $EE3D              ; $CDD2 4C 3D EE

_label_cdd5:
 rts                    ; $CDD5 60

;.byte $a2, $08, $a5, $09, $dd, $8b, $db, $b0, $03, $ca, $10, $f8, $a5, $d0, $29, $7f ; $CDB5
;.byte $85, $e3, $e4, $e3, $b0, $0a, $8a, $09, $80, $85, $d0, $a9, $0a, $4c, $3d, $ee ; $CDC5
;.byte $60                        ; $CDD5

; score (offset 0x1E) for upper table right 500 chute
  jsr _func_cd9c                 ; $CDD6  20 9C CD
  lda z:_var_00d1                ; $CDD9  A5 D1
  ora #$80                       ; $CDDB  09 80
  sta z:_var_00d1                ; $CDDD  85 D1
  lda #$1E                       ; $CDDF  A9 1E
  jmp _func_ee3d                 ; $CDE1  4C 3D EE

 ldx #$00               ; $CDE4 A2 00
 bit $01A2              ; $CDE6 2C A2 01
 stx $E3                ; $CDE9 86 E3
 lda $DBAE,X            ; $CDEB BD AE DB
 sta $0B                ; $CDEE 85 0B
 sec                    ; $CDF0 38
 sbc $07                ; $CDF1 E5 07
 sta $06                ; $CDF3 85 06
 lda $DBB2,X            ; $CDF5 BD B2 DB
 sta $0D                ; $CDF8 85 0D
 sec                    ; $CDFA 38
 sbc $09                ; $CDFB E5 09
 sta $08                ; $CDFD 85 08
 jsr _func_dcaa              ; $CDFF 20 AA DC
 lda $06                ; $CE02 A5 06
 cmp #$0D               ; $CE04 C9 0D
 bcs _label_ce18              ; $CE06 B0 10
 jsr $CD9C              ; $CE08 20 9C CD
 lda $E3                ; $CE0B A5 E3
 ora #$80               ; $CE0D 09 80
 sta $D2                ; $CE0F 85 D2
 lda #$01               ; $CE11 A9 01
 sta $FF                ; $CE13 85 FF
 jmp _label_de52              ; $CE15 4C 52 DE

_label_ce18:
 rts                    ; $CE18 60
 
;.byte $a2, $00, $2c, $a2, $01, $86, $e3, $bd, $ae, $db, $85, $0b, $38, $e5, $07, $85 ; $CDE4
;.byte $06, $bd, $b2, $db, $85, $0d, $38, $e5, $09, $85, $08, $20, $aa, $dc, $a5, $06 ; $CDF4
;.byte $c9, $0d, $b0, $10, $20, $9c, $cd, $a5, $e3, $09, $80, $85, $d2, $a9, $01, $85 ; $CE04
;.byte $ff, $4c, $52, $de, $60    ; $CE14

; cards check ($0128 tracks), score offset 0x41 if all revealed
  jsr _func_cd9c                 ; $CE19  20 9C CD
  ldx z:_var_0043                ; $CE1C  A6 43
  dex                            ; $CE1E  CA
  lda a:_data_d7dd_indexed,X     ; $CE1F  BD DD D7
  pha                            ; $CE22  48
  eor a:_var_lowerTableCards                ; $CE23  4D 28 01
  cmp #$F8                       ; $CE26  C9 F8
  bne _label_ce33                ; $CE28  D0 09
  lda #$41                       ; $CE2A  A9 41
  jsr _func_ee3d                 ; $CE2C  20 3D EE
  lda #$01                       ; $CE2F  A9 01
  sta z:_var_00fd                ; $CE31  85 FD

; score for lower table cards = 500 (offset 0x1E)
_label_ce33:
  pla                            ; $CE33  68
  sta z:_var_00d3                ; $CE34  85 D3
  lda #$1E                       ; $CE36  A9 1E
  jmp _func_ee3d                 ; $CE38  4C 3D EE
  jsr _func_cd9c                 ; $CE3B  20 9C CD
  lda z:_var_0043                ; $CE3E  A5 43
  lsr a                          ; $CE40  4A
  tax                            ; $CE41  AA
  lda a:_data_d7dd_indexed,X     ; $CE42  BD DD D7
  sta z:_var_00d4                ; $CE45  85 D4
  rts                            ; $CE47  60
  jsr _func_cd9c                 ; $CE48  20 9C CD
  lda z:_var_0043                ; $CE4B  A5 43
  lsr a                          ; $CE4D  4A
  tax                            ; $CE4E  AA
  lda a:_data_d7dd_indexed,X     ; $CE4F  BD DD D7
  sta z:_var_00d5                ; $CE52  85 D5
  rts                            ; $CE54  60
  jsr _func_cd9c                 ; $CE55  20 9C CD
  lda #$37                       ; $CE58  A9 37
  jmp _func_ee3d                 ; $CE5A  4C 3D EE

 jsr _func_cd9c         ; $CE5D 20 9C CD
 lda z:_var_0043                ; $CE60 A5 43
 lsr A          ; $CE62 4A
 tax                    ; $CE63 AA
 ldy z:_var_0041                ; $CE64 A4 41
 lda a:_data_d7dd_indexed,Y            ; $CE66 B9 DD D7
 sta z:_var_00d8_indexed,X              ; $CE69 95 D8
 rts                    ; $CE6B 60
 
; .byte $20, $9c, $cd, $a5, $43, $4a, $aa, $a4, $41, $b9, $dd, $d7, $95, $d8, $60 ; $CE5D

_func_ce6c:
  lda #$00                       ; $CE6C  A9 00
  ldx #$47                       ; $CE6E  A2 47

_label_ce70:
  sta z:_var_006a_indexed,X      ; $CE70  95 6A
  dex                            ; $CE72  CA
  bpl _label_ce70                ; $CE73  10 FB
  ldx #$1F                       ; $CE75  A2 1F

_label_ce77:
  sta z:_var_002a_indexed,X      ; $CE77  95 2A
  dex                            ; $CE79  CA
  bpl _label_ce77                ; $CE7A  10 FB
  sta z:_var_0025                ; $CE7C  85 25
  jsr _func_de30                 ; $CE7E  20 30 DE
  lda z:_var_0007_indexed        ; $CE81  A5 07
  sec                            ; $CE83  38
  sbc #$06                       ; $CE84  E9 06
  sta z:_var_0006_indexed        ; $CE86  85 06
  lda z:_var_0009                ; $CE88  A5 09
  sec                            ; $CE8A  38
  sbc #$06                       ; $CE8B  E9 06
  sta z:_var_0008                ; $CE8D  85 08
  jsr _func_dfe8                 ; $CE8F  20 E8 DF
  lda #$08                       ; $CE92  A9 08
  sta z:_var_00e6                ; $CE94  85 E6

_label_ce96:
  ldx z:_var_00e6                ; $CE96  A6 E6
  ldy a:_data_d74b_indexed,X     ; $CE98  BC 4B D7
  lda (_var_00db_indexed),Y      ; $CE9B  B1 DB
  jsr _func_d4a1                 ; $CE9D  20 A1 D4
  inx                            ; $CEA0  E8
  txa                            ; $CEA1  8A
  asl a                          ; $CEA2  0A
  asl a                          ; $CEA3  0A
  asl a                          ; $CEA4  0A
  tax                            ; $CEA5  AA
  dex                            ; $CEA6  CA
  ldy #$07                       ; $CEA7  A0 07

_label_cea9:
  lda (_var_00df_indexed),Y      ; $CEA9  B1 DF
  sta z:_var_006a_indexed,X      ; $CEAB  95 6A
  dex                            ; $CEAD  CA
  dey                            ; $CEAE  88
  bpl _label_cea9                ; $CEAF  10 F8
  dec z:_var_00e6                ; $CEB1  C6 E6
  bpl _label_ce96                ; $CEB3  10 E1
  ldx z:_var_00b4                ; $CEB5  A6 B4
  lda a:_data_d7ed_indexed,X     ; $CEB7  BD ED D7
  sta z:_var_00df_indexed        ; $CEBA  85 DF
  lda a:_data_d7f5_indexed,X     ; $CEBC  BD F5 D7
  sta z:_var_00e0                ; $CEBF  85 E0
  ldx z:_var_00b5                ; $CEC1  A6 B5
  ldy #$00                       ; $CEC3  A0 00

_label_cec5:
  lda #$0D                       ; $CEC5  A9 0D
  sta z:_var_00e6                ; $CEC7  85 E6

_label_cec9:
  lda (_var_00df_indexed),Y      ; $CEC9  B1 DF
  and z:_var_006a_indexed,X      ; $CECB  35 6A
  beq _label_ced1                ; $CECD  F0 02
  inc z:_var_0025                ; $CECF  E6 25

_label_ced1:
  sta a:_var_006a_indexed,Y      ; $CED1  99 6A 00
  inx                            ; $CED4  E8
  iny                            ; $CED5  C8
  dec z:_var_00e6                ; $CED6  C6 E6
  bne _label_cec9                ; $CED8  D0 EF
  txa                            ; $CEDA  8A
  clc                            ; $CEDB  18
  adc #$0B                       ; $CEDC  69 0B
  tax                            ; $CEDE  AA
  cpy #$27                       ; $CEDF  C0 27
  bne _label_cec5                ; $CEE1  D0 E2
  lda z:_var_0025                ; $CEE3  A5 25
  bne _label_ceea                ; $CEE5  D0 03
  jmp _label_cf82                ; $CEE7  4C 82 CF

_label_ceea:
  lda #$00                       ; $CEEA  A9 00
  sta z:_var_0025                ; $CEEC  85 25
  lda #$0C                       ; $CEEE  A9 0C
  sta z:_var_00e6                ; $CEF0  85 E6

_label_cef2:
  ldx z:_var_00e6                ; $CEF2  A6 E6
  lda z:_var_006a_indexed,X      ; $CEF4  B5 6A
  sta z:_var_0027                ; $CEF6  85 27
  lda z:_var_0077_indexed,X      ; $CEF8  B5 77
  sta z:_var_0028                ; $CEFA  85 28
  lda z:_var_0084_indexed,X      ; $CEFC  B5 84
  sta z:_var_0029                ; $CEFE  85 29
  ldy #$00                       ; $CF00  A0 00
  sty z:_var_0026                ; $CF02  84 26

_label_cf04:
  lda z:_var_0027                ; $CF04  A5 27
  ora z:_var_0028                ; $CF06  05 28
  ora z:_var_0029                ; $CF08  05 29
  beq _label_cf7b                ; $CF0A  F0 6F
  lda z:_var_0027                ; $CF0C  A5 27
  bne _label_cf25                ; $CF0E  D0 15
  lda z:_var_0028                ; $CF10  A5 28
  sta z:_var_0027                ; $CF12  85 27
  lda z:_var_0029                ; $CF14  A5 29
  sta z:_var_0028                ; $CF16  85 28
  lda #$00                       ; $CF18  A9 00
  sta z:_var_0029                ; $CF1A  85 29
  lda z:_var_0026                ; $CF1C  A5 26
  clc                            ; $CF1E  18
  adc #$08                       ; $CF1F  69 08
  sta z:_var_0026                ; $CF21  85 26
  bpl _label_cf04                ; $CF23  10 DF

_label_cf25:
  asl z:_var_0029                ; $CF25  06 29
  rol z:_var_0028                ; $CF27  26 28
  rol z:_var_0027                ; $CF29  26 27
  bcc _label_cf76                ; $CF2B  90 49
  inc z:_var_0025                ; $CF2D  E6 25
  ldx z:_var_00e6                ; $CF2F  A6 E6
  lda a:_data_d754_indexed,X     ; $CF31  BD 54 D7
  tax                            ; $CF34  AA
  lda z:_var_0026                ; $CF35  A5 26
  sec                            ; $CF37  38
  sbc z:_var_00b4                ; $CF38  E5 B4

_label_cf3a:
  cmp a:_data_d761_indexed,X     ; $CF3A  DD 61 D7
  beq _label_cf43                ; $CF3D  F0 04
  inx                            ; $CF3F  E8
  inx                            ; $CF40  E8
  bne _label_cf3a                ; $CF41  D0 F7

_label_cf43:
  lda a:_data_d762_indexed,X     ; $CF43  BD 62 D7
  pha                            ; $CF46  48
  lda z:_var_0026                ; $CF47  A5 26
  lsr a                          ; $CF49  4A
  lsr a                          ; $CF4A  4A
  lsr a                          ; $CF4B  4A
  tax                            ; $CF4C  AA
  lda a:_data_d7a1_indexed,X     ; $CF4D  BD A1 D7
  sta z:_var_00e3                ; $CF50  85 E3
  lda z:_var_00e6                ; $CF52  A5 E6
  clc                            ; $CF54  18
  adc z:_var_00b5                ; $CF55  65 B5
  lsr a                          ; $CF57  4A
  lsr a                          ; $CF58  4A
  lsr a                          ; $CF59  4A
  clc                            ; $CF5A  18
  adc z:_var_00e3                ; $CF5B  65 E3
  tax                            ; $CF5D  AA
  tya                            ; $CF5E  98
  pha                            ; $CF5F  48
  ldy a:_data_d74b_indexed,X     ; $CF60  BC 4B D7
  lda (_var_00db_indexed),Y      ; $CF63  B1 DB
  sta z:_var_00e3                ; $CF65  85 E3
  sty z:_var_00e4                ; $CF67  84 E4
  pla                            ; $CF69  68
  tay                            ; $CF6A  A8
  pla                            ; $CF6B  68
  tax                            ; $CF6C  AA
  lda z:_var_00e3                ; $CF6D  A5 E3
  sta z:_var_002a_indexed,X      ; $CF6F  95 2A
  lda z:_var_00e4                ; $CF71  A5 E4
  sta z:_var_004a_indexed,X      ; $CF73  95 4A
  iny                            ; $CF75  C8

_label_cf76:
  inc z:_var_0026                ; $CF76  E6 26
  jmp _label_cf04                ; $CF78  4C 04 CF

_label_cf7b:
  dec z:_var_00e6                ; $CF7B  C6 E6
  bmi _label_cf82                ; $CF7D  30 03
  jmp _label_cef2                ; $CF7F  4C F2 CE

_label_cf82:
  ldy z:_var_0025                ; $CF82  A4 25
  beq _label_cfd3                ; $CF84  F0 4D
  ldx #$00                       ; $CF86  A2 00
  ldy #$00                       ; $CF88  A0 00

_label_cf8a:
  cpx #$20                       ; $CF8A  E0 20
  bcs _label_cfd3                ; $CF8C  B0 45
  lda z:_var_002a_indexed,X      ; $CF8E  B5 2A
  bne _label_cf95                ; $CF90  D0 03
  inx                            ; $CF92  E8
  bne _label_cf8a                ; $CF93  D0 F5

_label_cf95:
  stx z:_var_0025                ; $CF95  86 25

_label_cf97:
  inx                            ; $CF97  E8
  cpx #$20                       ; $CF98  E0 20
  bne _label_cf9e                ; $CF9A  D0 02
  ldx #$00                       ; $CF9C  A2 00

_label_cf9e:
  lda z:_var_002a_indexed,X      ; $CF9E  B5 2A
  bne _label_cf97                ; $CFA0  D0 F5
  dex                            ; $CFA2  CA
  bpl _label_cfa7                ; $CFA3  10 02
  ldx #$1F                       ; $CFA5  A2 1F

_label_cfa7:
  txa                            ; $CFA7  8A
  cmp z:_var_0025                ; $CFA8  C5 25
  bcc _label_cfc1                ; $CFAA  90 15
  clc                            ; $CFAC  18
  adc z:_var_0025                ; $CFAD  65 25
  lsr a                          ; $CFAF  4A
  sta a:_var_006a_indexed,Y      ; $CFB0  99 6A 00
  stx z:_var_00e3                ; $CFB3  86 E3
  tax                            ; $CFB5  AA
  lda z:_var_002a_indexed,X      ; $CFB6  B5 2A
  sta a:_var_007a_indexed,Y      ; $CFB8  99 7A 00
  ldx z:_var_00e3                ; $CFBB  A6 E3
  inx                            ; $CFBD  E8
  iny                            ; $CFBE  C8
  bne _label_cf8a                ; $CFBF  D0 C9

_label_cfc1:
  adc z:_var_0025                ; $CFC1  65 25
  adc #$20                       ; $CFC3  69 20
  lsr a                          ; $CFC5  4A
  cmp #$20                       ; $CFC6  C9 20
  bcc _label_cfcc                ; $CFC8  90 02
  sbc #$20                       ; $CFCA  E9 20

_label_cfcc:
  sta z:_var_006a_indexed        ; $CFCC  85 6A
  tax                            ; $CFCE  AA
  lda z:_var_002a_indexed,X      ; $CFCF  B5 2A
  sta z:_var_007a_indexed        ; $CFD1  85 7A

_label_cfd3:
  sty z:_var_0026                ; $CFD3  84 26

_label_cfd5:
  dey                            ; $CFD5  88
  bmi _label_cfeb                ; $CFD6  30 13
  lda z:_var_00db_indexed        ; $CFD8  A5 DB
  clc                            ; $CFDA  18
  ldx z:_var_006a_indexed,Y      ; $CFDB  B6 6A
  adc z:_var_004a_indexed,X      ; $CFDD  75 4A
  sta a:_var_008a_indexed,Y      ; $CFDF  99 8A 00
  lda z:_var_00dc                ; $CFE2  A5 DC
  adc #$00                       ; $CFE4  69 00
  sta a:_var_009a_indexed,Y      ; $CFE6  99 9A 00
  bcc _label_cfd5                ; $CFE9  90 EA

_label_cfeb:
  rts                            ; $CFEB  60

_func_cfec:
  jsr _func_de30                 ; $CFEC  20 30 DE
  ldx z:_var_0026                ; $CFEF  A6 26
  ldy z:_var_006a_indexed,X      ; $CFF1  B4 6A
  tya                            ; $CFF3  98
  clc                            ; $CFF4  18
  adc #$04                       ; $CFF5  69 04
  lsr a                          ; $CFF7  4A
  lsr a                          ; $CFF8  4A
  lsr a                          ; $CFF9  4A
  tax                            ; $CFFA  AA
  lda a:_data_d7a4_indexed,X     ; $CFFB  BD A4 D7
  sta z:_var_0025                ; $CFFE  85 25
  lda a:_data_d7a9_indexed,Y     ; $D000  B9 A9 D7
  clc                            ; $D003  18
  adc z:_var_0007_indexed        ; $D004  65 07
  sta z:_var_0006_indexed        ; $D006  85 06
  lda a:_data_d7b1_indexed,Y     ; $D008  B9 B1 D7
  clc                            ; $D00B  18
  adc z:_var_0009                ; $D00C  65 09
  sta z:_var_0008                ; $D00E  85 08
  jsr _func_ddac                 ; $D010  20 AC DD
  ldx z:_var_0025                ; $D013  A6 25
  lda a:_data_d7d1_indexed,X     ; $D015  BD D1 D7
  clc                            ; $D018  18
  adc z:_var_0006_indexed        ; $D019  65 06
  sta z:_var_0006_indexed        ; $D01B  85 06
  lda a:_data_d7d5_indexed,X     ; $D01D  BD D5 D7
  clc                            ; $D020  18
  adc z:_var_0008                ; $D021  65 08
  sta z:_var_0008                ; $D023  85 08
  jsr _func_dda3                 ; $D025  20 A3 DD
  jsr _func_d390                 ; $D028  20 90 D3
  beq _label_d030                ; $D02B  F0 03
  jmp _label_d093                ; $D02D  4C 93 D0

_label_d030:
  lda z:_var_0025                ; $D030  A5 25
  sta z:_var_002b                ; $D032  85 2B
  lda #$00                       ; $D034  A9 00
  sta z:_var_00e6                ; $D036  85 E6
  lda #$20                       ; $D038  A9 20
  sta z:_var_002a_indexed        ; $D03A  85 2A

_label_d03c:
  jsr _func_d3aa                 ; $D03C  20 AA D3
  ldx z:_var_00e6                ; $D03F  A6 E6
  sta z:_var_002e_indexed,X      ; $D041  95 2E
  cpx #$01                       ; $D043  E0 01
  bcs _label_d055                ; $D045  B0 0E
  lda z:_var_002b                ; $D047  A5 2B
  eor #$01                       ; $D049  49 01
  sta z:_var_002b                ; $D04B  85 2B
  inc z:_var_00e6                ; $D04D  E6 E6
  lda z:_var_002c                ; $D04F  A5 2C
  pha                            ; $D051  48
  jmp _label_d03c                ; $D052  4C 3C D0

_label_d055:
  pla                            ; $D055  68
  clc                            ; $D056  18
  adc z:_var_002c                ; $D057  65 2C
  sbc #$02                       ; $D059  E9 02
  tax                            ; $D05B  AA
  lda z:_var_002e_indexed        ; $D05C  A5 2E
  cmp z:$2F                      ; $D05E  C5 2F
  bne _label_d066                ; $D060  D0 04
  lda #$00                       ; $D062  A9 00
  beq _label_d07c                ; $D064  F0 16

_label_d066:
  cpx #$1C                       ; $D066  E0 1C
  bcc _label_d06c                ; $D068  90 02
  ldx #$1C                       ; $D06A  A2 1C

_label_d06c:
  ldy z:_var_002e_indexed        ; $D06C  A4 2E
  beq _label_d076                ; $D06E  F0 06
  lda a:_data_d928_indexed,X     ; $D070  BD 28 D9
  jmp _label_d07c                ; $D073  4C 7C D0

_label_d076:
  lda #$00                       ; $D076  A9 00
  sec                            ; $D078  38
  sbc a:_data_d928_indexed,X     ; $D079  FD 28 D9

_label_d07c:
  ldx z:_var_0025                ; $D07C  A6 25
  clc                            ; $D07E  18
  adc a:_data_d7d9_indexed,X     ; $D07F  7D D9 D7
  bne _label_d08f                ; $D082  D0 0B
  jsr _func_de63                 ; $D084  20 63 DE
  lda #$01                       ; $D087  A9 01
  ldx z:_var_0006_indexed        ; $D089  A6 06
  bmi _label_d08f                ; $D08B  30 02
  lda #$FF                       ; $D08D  A9 FF

_label_d08f:
  sta z:_var_0030                ; $D08F  85 30
  clc                            ; $D091  18
  rts                            ; $D092  60

_label_d093:
  jsr _func_de30                 ; $D093  20 30 DE
  ldx z:_var_0025                ; $D096  A6 25
  lda z:_var_0007_indexed        ; $D098  A5 07
  clc                            ; $D09A  18
  adc a:_data_d7d1_indexed,X     ; $D09B  7D D1 D7
  sta z:_var_0007_indexed        ; $D09E  85 07
  lda z:_var_0009                ; $D0A0  A5 09
  clc                            ; $D0A2  18
  adc a:_data_d7d5_indexed,X     ; $D0A3  7D D5 D7
  sta z:_var_0009                ; $D0A6  85 09
  jsr _func_de41                 ; $D0A8  20 41 DE
  sec                            ; $D0AB  38
  rts                            ; $D0AC  60

_func_d0ad:
  lda #$00                       ; $D0AD  A9 00
  sta z:_var_0031                ; $D0AF  85 31
  ldx z:_var_0026                ; $D0B1  A6 26
  lda z:_var_006a_indexed,X      ; $D0B3  B5 6A
  tax                            ; $D0B5  AA
  lda z:_var_0030                ; $D0B6  A5 30
  sec                            ; $D0B8  38
  sbc a:_data_d945_indexed,X     ; $D0B9  FD 45 D9
  bmi _label_d0c9                ; $D0BC  30 0B
  tay                            ; $D0BE  A8
  txa                            ; $D0BF  8A
  and #$07                       ; $D0C0  29 07
  tax                            ; $D0C2  AA
  tya                            ; $D0C3  98
  cmp a:_data_d965_indexed,X     ; $D0C4  DD 65 D9
  bcc _label_d0d2                ; $D0C7  90 09

_label_d0c9:
  ldx z:_var_0026                ; $D0C9  A6 26
  ldy z:_var_006a_indexed,X      ; $D0CB  B4 6A
  lda a:_data_d96d_indexed,Y     ; $D0CD  B9 6D D9
  sta z:_var_0030                ; $D0D0  85 30

_label_d0d2:
  jsr _func_d0e0                 ; $D0D2  20 E0 D0
  bcs _label_d0df                ; $D0D5  B0 08
  jsr _func_d191                 ; $D0D7  20 91 D1
  bcs _label_d0df                ; $D0DA  B0 03
  jmp _label_d359                ; $D0DC  4C 59 D3

_label_d0df:
  rts                            ; $D0DF  60

_func_d0e0:
  jsr _func_de63                 ; $D0E0  20 63 DE
  jsr _func_dc3e                 ; $D0E3  20 3E DC
  sta z:_var_0034                ; $D0E6  85 34
  lda z:_var_0030                ; $D0E8  A5 30
  sec                            ; $D0EA  38
  sbc z:_var_0034                ; $D0EB  E5 34
  beq _label_d0f5                ; $D0ED  F0 06
  sta z:_var_0033                ; $D0EF  85 33
  cmp #$80                       ; $D0F1  C9 80
  bcc _label_d0f8                ; $D0F3  90 03

_label_d0f5:
  jmp _label_d093                ; $D0F5  4C 93 D0

_label_d0f8:
  jsr _func_de63                 ; $D0F8  20 63 DE
  jsr _func_dcaa                 ; $D0FB  20 AA DC
  lda z:_var_0006_indexed        ; $D0FE  A5 06
  sta z:_var_0035                ; $D100  85 35
  cmp #$07                       ; $D102  C9 07
  bcs _label_d157                ; $D104  B0 51
  lda z:_var_0031                ; $D106  A5 31
  cmp #$02                       ; $D108  C9 02
  bne _label_d10e                ; $D10A  D0 02
  sec                            ; $D10C  38
  rts                            ; $D10D  60

_label_d10e:
  lda z:_var_0030                ; $D10E  A5 30
  cmp #$20                       ; $D110  C9 20
  bcs _label_d118                ; $D112  B0 04
  lda #$FD                       ; $D114  A9 FD
  bne _label_d11e                ; $D116  D0 06

_label_d118:
  cmp #$E1                       ; $D118  C9 E1
  bcc _label_d157                ; $D11A  90 3B
  lda #$03                       ; $D11C  A9 03

_label_d11e:
  ldx z:_var_tableUpperOrLower                ; $D11E  A6 BF
  cpx #$02                       ; $D120  E0 02
  bne _label_d125                ; $D122  D0 01
  asl a                          ; $D124  0A

_label_d125:
  sta z:_var_0006_indexed        ; $D125  85 06
  lda #$FB                       ; $D127  A9 FB
  sta z:_var_0008                ; $D129  85 08
  jsr _func_de75                 ; $D12B  20 75 DE
  lda z:_var_tableUpperOrLower                ; $D12E  A5 BF
  cmp #$01                       ; $D130  C9 01
  bne _label_d154                ; $D132  D0 20
  jsr _func_de30                 ; $D134  20 30 DE
  lda z:_var_0007_indexed        ; $D137  A5 07
  cmp #$E1                       ; $D139  C9 E1
  bcc _label_d154                ; $D13B  90 17
  jsr _func_ead1                 ; $D13D  20 D1 EA
  asl a                          ; $D140  0A
  asl a                          ; $D141  0A
  sta z:_var_00e3                ; $D142  85 E3
  lda #$CD                       ; $D144  A9 CD
  sec                            ; $D146  38
  sbc z:_var_00e3                ; $D147  E5 E3
  sta z:_var_0008                ; $D149  85 08
  lda #$00                       ; $D14B  A9 00
  sta z:_var_0006_indexed        ; $D14D  85 06
  jsr _func_de75                 ; $D14F  20 75 DE
  sec                            ; $D152  38
  rts                            ; $D153  60

_label_d154:
  jmp _label_d093                ; $D154  4C 93 D0

_label_d157:
  clc                            ; $D157  18
  rts                            ; $D158  60

_func_d159:
  lda z:_var_0035                ; $D159  A5 35

_func_d15b:
  sta z:_var_0006_indexed        ; $D15B  85 06
  lda z:_var_0033                ; $D15D  A5 33
  jsr _func_dd78                 ; $D15F  20 78 DD
  jsr _func_dcdd                 ; $D162  20 DD DC
  lda z:_var_0007_indexed        ; $D165  A5 07
  sta z:_var_0036                ; $D167  85 36
  lda z:_var_0035                ; $D169  A5 35
  sta z:_var_0006_indexed        ; $D16B  85 06
  lda z:_var_0033                ; $D16D  A5 33
  jsr _func_dd75                 ; $D16F  20 75 DD
  jsr _func_dcdd                 ; $D172  20 DD DC
  lda z:_var_0007_indexed        ; $D175  A5 07
  sta z:_var_0037                ; $D177  85 37
  lda z:_var_0030                ; $D179  A5 30
  clc                            ; $D17B  18
  adc #$40                       ; $D17C  69 40
  sta z:_var_0038                ; $D17E  85 38
  lda z:_var_0030                ; $D180  A5 30
  ldx z:_var_0033                ; $D182  A6 33
  cpx #$40                       ; $D184  E0 40
  bcc _label_d18e                ; $D186  90 06
  cpx #$C0                       ; $D188  E0 C0
  bcs _label_d18e                ; $D18A  B0 02
  adc #$7F                       ; $D18C  69 7F

_label_d18e:
  sta z:_var_0039                ; $D18E  85 39
  rts                            ; $D190  60

_func_d191:
  jsr _func_de30                 ; $D191  20 30 DE
  ldx z:_var_0026                ; $D194  A6 26
  lda z:_var_007a_indexed,X      ; $D196  B5 7A
  cmp #$7F                       ; $D198  C9 7F
  bcc _label_d1b8                ; $D19A  90 1C
  cmp #$8B                       ; $D19C  C9 8B
  bcs _label_d1b8                ; $D19E  B0 18
  sbc #$7E                       ; $D1A0  E9 7E
  asl a                          ; $D1A2  0A
  and #$04                       ; $D1A3  29 04
  tax                            ; $D1A5  AA
  ldy #$00                       ; $D1A6  A0 00
  lda z:_var_0007_indexed        ; $D1A8  A5 07

_label_d1aa:
  cmp a:_data_d9a7_indexed,X     ; $D1AA  DD A7 D9
  bcc _label_d1b3                ; $D1AD  90 04
  inx                            ; $D1AF  E8
  iny                            ; $D1B0  C8
  bne _label_d1aa                ; $D1B1  D0 F7

_label_d1b3:
  tya                            ; $D1B3  98
  ldy #$00                       ; $D1B4  A0 00
  beq _label_d1ce                ; $D1B6  F0 16

_label_d1b8:
  ldy z:_var_tableUpperOrLower                ; $D1B8  A4 BF
  ldx a:_data_d98d_indexed,Y     ; $D1BA  BE 8D D9

_label_d1bd:
  cmp a:_data_d990_indexed,X     ; $D1BD  DD 90 D9
  beq _label_d1ca                ; $D1C0  F0 08
  ldy a:_data_d990_indexed,X     ; $D1C2  BC 90 D9
  beq _label_d1d1                ; $D1C5  F0 0A
  inx                            ; $D1C7  E8
  bne _label_d1bd                ; $D1C8  D0 F3

_label_d1ca:
  lda #$00                       ; $D1CA  A9 00
  ldy #$01                       ; $D1CC  A0 01

_label_d1ce:
  jmp _label_d296                ; $D1CE  4C 96 D2

_label_d1d1:
  cmp #$20                       ; $D1D1  C9 20
  bcc _label_d203                ; $D1D3  90 2E
  cmp #$23                       ; $D1D5  C9 23
  bcs _label_d203                ; $D1D7  B0 2A
  sec                            ; $D1D9  38
  sbc #$20                       ; $D1DA  E9 20
  tax                            ; $D1DC  AA
  lda z:_var_0034                ; $D1DD  A5 34
  sec                            ; $D1DF  38
  sbc a:_data_d9bd_indexed,X     ; $D1E0  FD BD D9
  cmp #$80                       ; $D1E3  C9 80
  bcc _label_d1ea                ; $D1E5  90 03
  jmp _label_d2e4                ; $D1E7  4C E4 D2

_label_d1ea:
  lda z:_var_00cd                ; $D1EA  A5 CD
  ora a:_data_d7dd_indexed,X     ; $D1EC  1D DD D7
  sta z:_var_00cd                ; $D1EF  85 CD
  ldx z:_var_0026                ; $D1F1  A6 26
  lda z:_var_008a_indexed,X      ; $D1F3  B5 8A
  sta z:_var_00db_indexed        ; $D1F5  85 DB
  lda z:_var_009a_indexed,X      ; $D1F7  B5 9A
  sta z:_var_00dc                ; $D1F9  85 DC

_func_d1fb:
  ldy #$00                       ; $D1FB  A0 00
  lda #$24                       ; $D1FD  A9 24
  sta (_var_00db_indexed),Y      ; $D1FF  91 DB
  sec                            ; $D201  38
  rts                            ; $D202  60

; determining if, and which, upper table tab (left of penguins) hit
; $D7DD,Y is the one hit
; $0130 (high bits) tracks which ones have been hit, top = 0x08, bottom = 0x01
_label_d203:
  cmp #$8B                       ; $D203  C9 8B
  bne _label_d248                ; $D205  D0 41
  ldx z:_var_0026                ; $D207  A6 26
  lda z:_var_009a_indexed,X      ; $D209  B5 9A
  sta z:_var_00dc                ; $D20B  85 DC
  and #$03                       ; $D20D  29 03
  sta z:_var_00e3                ; $D20F  85 E3
  lda z:_var_008a_indexed,X      ; $D211  B5 8A
  sta z:_var_00db_indexed        ; $D213  85 DB
  asl a                          ; $D215  0A
  rol z:_var_00e3                ; $D216  26 E3
  asl a                          ; $D218  0A
  rol z:_var_00e3                ; $D219  26 E3
  asl a                          ; $D21B  0A
  rol z:_var_00e3                ; $D21C  26 E3
  ldx z:_var_tableUpperOrLower                ; $D21E  A6 BF
  lda z:_var_00e3                ; $D220  A5 E3
  sec                            ; $D222  38
  sbc a:_data_d9c0_indexed,X     ; $D223  FD C0 D9
  tay                            ; $D226  A8
  lda a:_data_d7dd_indexed,Y     ; $D227  B9 DD D7
  pha                            ; $D22A  48
  eor a:_var_upperTableFlags,X      ; $D22B  5D 30 01
  cmp a:_data_d9af_indexed,X     ; $D22E  DD AF D9
  bne _label_d238                ; $D231  D0 05
  lda #$37                       ; $D233  A9 37
  jsr _func_ee3d                 ; $D235  20 3D EE

; scoring offset for upper table tabs left of penguins (0x0A) = 100
; scoring offset for lower table tabs left of bumpers (0x0A) = 100
_label_d238:
  pla                            ; $D238  68
  ora z:_var_00ce                ; $D239  05 CE
  sta z:_var_00ce                ; $D23B  85 CE
  lda #$0A                       ; $D23D  A9 0A
  jsr _func_ee3d                 ; $D23F  20 3D EE
  jsr _func_d1fb                 ; $D242  20 FB D1
  jmp _label_d2e4                ; $D245  4C E4 D2

_label_d248:
  cmp #$23                       ; $D248  C9 23
  bne _label_d261                ; $D24A  D0 15
  lda z:_var_00cf                ; $D24C  A5 CF
  bmi _label_d25b                ; $D24E  30 0B
  tax                            ; $D250  AA
  ora #$80                       ; $D251  09 80
  sta z:_var_00cf                ; $D253  85 CF
  lda a:_data_d9c2_indexed,X     ; $D255  BD C2 D9
  jsr _func_ee3d                 ; $D258  20 3D EE

_label_d25b:
  lda #$00                       ; $D25B  A9 00
  ldy #$04                       ; $D25D  A0 04
  bne _label_d296                ; $D25F  D0 35

_label_d261:
  cmp #$A6                       ; $D261  C9 A6
  bcc _label_d2e4                ; $D263  90 7F
  cmp #$AE                       ; $D265  C9 AE
  bcc _label_d271                ; $D267  90 08
  cmp #$DD                       ; $D269  C9 DD
  bcc _label_d2e4                ; $D26B  90 77
  cmp #$E5                       ; $D26D  C9 E5
  bcs _label_d2e4                ; $D26F  B0 73

_label_d271:
  lda z:_var_tableUpperOrLower                ; $D271  A5 BF
  beq _label_d288                ; $D273  F0 13
  tay                            ; $D275  A8
  iny                            ; $D276  C8
  lda #$02                       ; $D277  A9 02
  sta z:_var_00ff                ; $D279  85 FF
  jsr _func_d386                 ; $D27B  20 86 D3
  txa                            ; $D27E  8A
  cpy #$03                       ; $D27F  C0 03
  beq _label_d296                ; $D281  F0 13
  pha                            ; $D283  48
  sty z:_var_0032                ; $D284  84 32
  bne _label_d2b8                ; $D286  D0 30

; score (offset 0x0A) - upper table pink platform below 100 bumper
_label_d288:
  lda z:_var_00d1                ; $D288  A5 D1
  ora #$01                       ; $D28A  09 01
  sta z:_var_00d1                ; $D28C  85 D1
  lda #$0A                       ; $D28E  A9 0A
  jsr _func_ee3d                 ; $D290  20 3D EE
  jmp _label_d2e4                ; $D293  4C E4 D2

_label_d296:
  sty z:_var_0032                ; $D296  84 32
  pha                            ; $D298  48
  lda #$3F                       ; $D299  A9 3F
  ldx z:_var_0030                ; $D29B  A6 30
  inx                            ; $D29D  E8
  cpx #$03                       ; $D29E  E0 03
  bcc _label_d2a3                ; $D2A0  90 01
  lsr a                          ; $D2A2  4A

_label_d2a3:
  sta z:_var_00e3                ; $D2A3  85 E3
  jsr _func_e3e2                 ; $D2A5  20 E2 E3
  and z:_var_00e3                ; $D2A8  25 E3
  lsr z:_var_00e3                ; $D2AA  46 E3
  sbc z:_var_00e3                ; $D2AC  E5 E3
  adc z:_var_0033                ; $D2AE  65 33
  beq _label_d2b8                ; $D2B0  F0 06
  cmp #$7F                       ; $D2B2  C9 7F
  bcs _label_d2b8                ; $D2B4  B0 02
  sta z:_var_0033                ; $D2B6  85 33

; score for upper table upper left/right of chutes 10 hit (offset table $D9D6)
; score for lower table 100 bumpers hit
; score for lower table lower pink bumpers = 10
_label_d2b8:
  jsr _func_d159                 ; $D2B8  20 59 D1
  ldy z:_var_0032                ; $D2BB  A4 32
  ldx a:_data_d9cc_indexed,Y     ; $D2BD  BE CC D9
  cpx z:_var_0036                ; $D2C0  E4 36
  pla                            ; $D2C2  68
  bcs _label_d2e7                ; $D2C3  B0 22
  adc a:_data_d9d1_indexed,Y     ; $D2C5  79 D1 D9
  tax                            ; $D2C8  AA
  lda #$FF                       ; $D2C9  A9 FF
  sta z:_var_0000_indexed,X      ; $D2CB  95 00
  lda a:_data_d9d6_indexed,Y     ; $D2CD  B9 D6 D9
  jsr _func_ee3d                 ; $D2D0  20 3D EE
  ldy z:_var_0032                ; $D2D3  A4 32
  lda a:_data_d9db_indexed,Y     ; $D2D5  B9 DB D9
  lsr z:_var_0036                ; $D2D8  46 36
  adc z:_var_0036                ; $D2DA  65 36
  bcc _label_d2e0                ; $D2DC  90 02
  lda #$7F                       ; $D2DE  A9 7F

_label_d2e0:
  sta z:_var_0036                ; $D2E0  85 36
  bne _func_d2e9                 ; $D2E2  D0 05

_label_d2e4:
  jsr _func_d159                 ; $D2E4  20 59 D1

_label_d2e7:
  lsr z:_var_0036                ; $D2E7  46 36

_func_d2e9:
  jsr _func_d334                 ; $D2E9  20 34 D3
  lda z:_var_0036                ; $D2EC  A5 36
  sta z:_var_0006_indexed        ; $D2EE  85 06
  lda z:_var_0038                ; $D2F0  A5 38
  jsr _func_dd8f                 ; $D2F2  20 8F DD
  jsr _func_dd32                 ; $D2F5  20 32 DD
  jsr _func_ddf1                 ; $D2F8  20 F1 DD
  lda z:_var_0037                ; $D2FB  A5 37
  sta z:_var_0006_indexed        ; $D2FD  85 06
  lda z:_var_0039                ; $D2FF  A5 39
  jsr _func_dd8f                 ; $D301  20 8F DD
  jsr _func_dd32                 ; $D304  20 32 DD
  lda z:_var_0006_indexed        ; $D307  A5 06
  clc                            ; $D309  18
  adc z:_var_000a_indexed        ; $D30A  65 0A
  pha                            ; $D30C  48
  lda z:_var_0036                ; $D30D  A5 36
  sta z:_var_0006_indexed        ; $D30F  85 06
  lda z:_var_0038                ; $D311  A5 38
  jsr _func_dd92                 ; $D313  20 92 DD
  jsr _func_dd32                 ; $D316  20 32 DD
  jsr _func_ddf1                 ; $D319  20 F1 DD
  lda z:_var_0037                ; $D31C  A5 37
  sta z:_var_0006_indexed        ; $D31E  85 06
  lda z:_var_0039                ; $D320  A5 39
  jsr _func_dd92                 ; $D322  20 92 DD
  jsr _func_dd32                 ; $D325  20 32 DD
  lda z:_var_0006_indexed        ; $D328  A5 06
  clc                            ; $D32A  18
  adc z:_var_000a_indexed        ; $D32B  65 0A
  sta z:_var_0008                ; $D32D  85 08
  pla                            ; $D32F  68
  sta z:_var_0006_indexed        ; $D330  85 06
  clc                            ; $D332  18
  rts                            ; $D333  60

_func_d334:
  lda #$7F                       ; $D334  A9 7F
  cmp z:_var_0036                ; $D336  C5 36
  bcs _label_d33c                ; $D338  B0 02
  sta z:_var_0036                ; $D33A  85 36

_label_d33c:
  ldx z:_var_0037                ; $D33C  A6 37
  lda #$01                       ; $D33E  A9 01
  sec                            ; $D340  38
  sbc a:_var_0300_indexed,X      ; $D341  FD 00 03
  sta z:_var_0006_indexed        ; $D344  85 06
  lda #$3F                       ; $D346  A9 3F
  sbc a:_data_de87_indexed,X     ; $D348  FD 87 DE
  sta z:_var_0007_indexed        ; $D34B  85 07
  jsr _func_dc0d                 ; $D34D  20 0D DC
  lda z:_var_0006_indexed        ; $D350  A5 06
  cmp z:_var_0036                ; $D352  C5 36
  bcs _label_d358                ; $D354  B0 02
  sta z:_var_0036                ; $D356  85 36

_label_d358:
  rts                            ; $D358  60

_label_d359:
  lda z:_var_0006_indexed        ; $D359  A5 06
  bmi _label_d365                ; $D35B  30 08
  cmp #$3F                       ; $D35D  C9 3F
  bcc _label_d36d                ; $D35F  90 0C
  lda #$3F                       ; $D361  A9 3F
  bne _label_d36b                ; $D363  D0 06

_label_d365:
  cmp #$C1                       ; $D365  C9 C1
  bcs _label_d36d                ; $D367  B0 04
  lda #$C1                       ; $D369  A9 C1

_label_d36b:
  sta z:_var_0006_indexed        ; $D36B  85 06

_label_d36d:
  lda z:_var_0008                ; $D36D  A5 08
  bmi _label_d379                ; $D36F  30 08
  cmp #$3F                       ; $D371  C9 3F
  bcc _label_d381                ; $D373  90 0C
  lda #$3F                       ; $D375  A9 3F
  bne _label_d37f                ; $D377  D0 06

_label_d379:
  cmp #$C1                       ; $D379  C9 C1
  bcs _label_d381                ; $D37B  B0 04
  lda #$C1                       ; $D37D  A9 C1

_label_d37f:
  sta z:_var_0008                ; $D37F  85 08

_label_d381:
  jsr _func_de75                 ; $D381  20 75 DE
  clc                            ; $D384  18
  rts                            ; $D385  60

_func_d386:
  ldx #$00                       ; $D386  A2 00
  lda z:_var_0007_indexed        ; $D388  A5 07
  cmp #$90                       ; $D38A  C9 90
  bcc _label_d38f                ; $D38C  90 01
  inx                            ; $D38E  E8

_label_d38f:
  rts                            ; $D38F  60

_func_d390:
  jsr _func_dfe8                 ; $D390  20 E8 DF
  ldy #$00                       ; $D393  A0 00
  lda (_var_00db_indexed),Y      ; $D395  B1 DB
  jsr _func_d4a1                 ; $D397  20 A1 D4
  ldy z:_var_00b5                ; $D39A  A4 B5
  lda (_var_00df_indexed),Y      ; $D39C  B1 DF
  ldx z:_var_00b4                ; $D39E  A6 B4
  ldy #$00                       ; $D3A0  A0 00
  and a:_data_d7dd_indexed,X     ; $D3A2  3D DD D7
  beq _label_d3a8                ; $D3A5  F0 01
  dey                            ; $D3A7  88

_label_d3a8:
  tya                            ; $D3A8  98
  rts                            ; $D3A9  60

_func_d3aa:
  lda #$00                       ; $D3AA  A9 00
  sta z:_var_002c                ; $D3AC  85 2C
  jsr _func_ddb5                 ; $D3AE  20 B5 DD
  jsr _func_dfe8                 ; $D3B1  20 E8 DF
  lda z:_var_00b4                ; $D3B4  A5 B4
  sta z:_var_003a                ; $D3B6  85 3A
  lda z:_var_00b5                ; $D3B8  A5 B5
  sta z:_var_003b                ; $D3BA  85 3B
  jsr _func_ddbe                 ; $D3BC  20 BE DD
  ldx #$DD                       ; $D3BF  A2 DD
  jsr _func_dfea                 ; $D3C1  20 EA DF
  lda z:_var_00b4                ; $D3C4  A5 B4
  sta z:_var_003c                ; $D3C6  85 3C
  lda z:_var_00b5                ; $D3C8  A5 B5
  sta z:_var_003d                ; $D3CA  85 3D

_label_d3cc:
  jsr _func_d4b9                 ; $D3CC  20 B9 D4
  ldy z:_var_003b                ; $D3CF  A4 3B
  lda z:_var_002b                ; $D3D1  A5 2B
  cmp #$02                       ; $D3D3  C9 02
  bcs _label_d441                ; $D3D5  B0 6A
  lda (_var_00df_indexed),Y      ; $D3D7  B1 DF
  sta z:_var_003e                ; $D3D9  85 3E
  ldy z:_var_003d                ; $D3DB  A4 3D
  lda (_var_00e1_indexed),Y      ; $D3DD  B1 E1
  sta z:_var_003f                ; $D3DF  85 3F
  ldx z:_var_003a                ; $D3E1  A6 3A
  lda z:_var_002b                ; $D3E3  A5 2B
  bne _label_d40f                ; $D3E5  D0 28
  txa                            ; $D3E7  8A
  beq _label_d3f4                ; $D3E8  F0 0A

_label_d3ea:
  asl z:_var_003e                ; $D3EA  06 3E
  asl z:_var_003f                ; $D3EC  06 3F
  dex                            ; $D3EE  CA
  bne _label_d3ea                ; $D3EF  D0 F9
  txa                            ; $D3F1  8A
  ldx z:_var_003a                ; $D3F2  A6 3A

_label_d3f4:
  inc z:_var_002c                ; $D3F4  E6 2C
  asl z:_var_003e                ; $D3F6  06 3E
  rol a                          ; $D3F8  2A
  asl z:_var_003f                ; $D3F9  06 3F
  adc #$00                       ; $D3FB  69 00
  lsr a                          ; $D3FD  4A
  bcc _label_d42a                ; $D3FE  90 2A
  dec z:_var_002a_indexed        ; $D400  C6 2A
  beq _label_d42e                ; $D402  F0 2A
  cpx #$07                       ; $D404  E0 07
  beq _label_d40b                ; $D406  F0 03
  inx                            ; $D408  E8
  bne _label_d3f4                ; $D409  D0 E9

_label_d40b:
  ldx #$00                       ; $D40B  A2 00
  beq _label_d439                ; $D40D  F0 2A

_label_d40f:
  cpx #$07                       ; $D40F  E0 07
  beq _label_d41e                ; $D411  F0 0B

_label_d413:
  lsr z:_var_003e                ; $D413  46 3E
  lsr z:_var_003f                ; $D415  46 3F
  inx                            ; $D417  E8
  cpx #$07                       ; $D418  E0 07
  bne _label_d413                ; $D41A  D0 F7
  ldx z:_var_003a                ; $D41C  A6 3A

_label_d41e:
  lda #$00                       ; $D41E  A9 00

_label_d420:
  inc z:_var_002c                ; $D420  E6 2C
  lsr z:_var_003e                ; $D422  46 3E
  rol a                          ; $D424  2A
  lsr z:_var_003f                ; $D425  46 3F
  adc #$00                       ; $D427  69 00
  lsr a                          ; $D429  4A

_label_d42a:
  bcc _label_d499                ; $D42A  90 6D
  dec z:_var_002a_indexed        ; $D42C  C6 2A

_label_d42e:
  beq _label_d497                ; $D42E  F0 67
  cpx #$00                       ; $D430  E0 00
  beq _label_d437                ; $D432  F0 03
  dex                            ; $D434  CA
  bpl _label_d420                ; $D435  10 E9

_label_d437:
  ldx #$07                       ; $D437  A2 07

_label_d439:
  stx z:_var_003a                ; $D439  86 3A
  jsr _func_d4cf                 ; $D43B  20 CF D4
  jmp _label_d3cc                ; $D43E  4C CC D3

_label_d441:
  cmp #$02                       ; $D441  C9 02
  bne _label_d46a                ; $D443  D0 25

_label_d445:
  inc z:_var_002c                ; $D445  E6 2C
  ldx z:_var_003a                ; $D447  A6 3A
  lda (_var_00df_indexed),Y      ; $D449  B1 DF
  and a:_data_d7dd_indexed,X     ; $D44B  3D DD D7
  php                            ; $D44E  08
  ldx z:_var_003c                ; $D44F  A6 3C
  lda (_var_00e1_indexed),Y      ; $D451  B1 E1
  and a:_data_d7dd_indexed,X     ; $D453  3D DD D7
  bne _label_d45c                ; $D456  D0 04
  plp                            ; $D458  28
  beq _label_d499                ; $D459  F0 3E
  php                            ; $D45B  08

_label_d45c:
  plp                            ; $D45C  28
  bne _label_d499                ; $D45D  D0 3A
  dec z:_var_002a_indexed        ; $D45F  C6 2A
  beq _label_d497                ; $D461  F0 34
  dey                            ; $D463  88
  bpl _label_d445                ; $D464  10 DF
  ldy #$07                       ; $D466  A0 07
  bne _label_d48f                ; $D468  D0 25

_label_d46a:
  inc z:_var_002c                ; $D46A  E6 2C
  ldx z:_var_003a                ; $D46C  A6 3A
  lda (_var_00df_indexed),Y      ; $D46E  B1 DF
  and a:_data_d7dd_indexed,X     ; $D470  3D DD D7
  php                            ; $D473  08
  ldx z:_var_003c                ; $D474  A6 3C
  lda (_var_00e1_indexed),Y      ; $D476  B1 E1
  and a:_data_d7dd_indexed,X     ; $D478  3D DD D7
  bne _label_d481                ; $D47B  D0 04
  plp                            ; $D47D  28
  beq _label_d499                ; $D47E  F0 19
  php                            ; $D480  08

_label_d481:
  plp                            ; $D481  28
  bne _label_d499                ; $D482  D0 15
  dec z:_var_002a_indexed        ; $D484  C6 2A
  beq _label_d497                ; $D486  F0 0F
  iny                            ; $D488  C8
  cpy #$08                       ; $D489  C0 08
  bne _label_d46a                ; $D48B  D0 DD
  ldy #$00                       ; $D48D  A0 00

_label_d48f:
  sty z:_var_003b                ; $D48F  84 3B
  jsr _func_d4cf                 ; $D491  20 CF D4
  jmp _label_d3cc                ; $D494  4C CC D3

_label_d497:
  lda #$00                       ; $D497  A9 00

_label_d499:
  ldx #$00                       ; $D499  A2 00
  tay                            ; $D49B  A8
  beq _label_d49f                ; $D49C  F0 01
  dex                            ; $D49E  CA

_label_d49f:
  txa                            ; $D49F  8A
  rts                            ; $D4A0  60

_func_d4a1:
  ldy #$00                       ; $D4A1  A0 00
  sty z:_var_00e0                ; $D4A3  84 E0
  asl a                          ; $D4A5  0A
  rol z:_var_00e0                ; $D4A6  26 E0
  asl a                          ; $D4A8  0A
  rol z:_var_00e0                ; $D4A9  26 E0
  asl a                          ; $D4AB  0A
  rol z:_var_00e0                ; $D4AC  26 E0
  adc #$B4                       ; $D4AE  69 B4
  sta z:_var_00df_indexed        ; $D4B0  85 DF
  lda z:_var_00e0                ; $D4B2  A5 E0
  adc #$F3                       ; $D4B4  69 F3
  sta z:_var_00e0                ; $D4B6  85 E0
  rts                            ; $D4B8  60

_func_d4b9:
  ldy #$00                       ; $D4B9  A0 00
  lda (_var_00dd_indexed),Y      ; $D4BB  B1 DD
  jsr _func_d4a1                 ; $D4BD  20 A1 D4
  lda z:_var_00df_indexed        ; $D4C0  A5 DF
  sta z:_var_00e1_indexed        ; $D4C2  85 E1
  lda z:_var_00e0                ; $D4C4  A5 E0
  sta z:_var_00e2                ; $D4C6  85 E2
  ldy #$00                       ; $D4C8  A0 00
  lda (_var_00db_indexed),Y      ; $D4CA  B1 DB
  jmp _func_d4a1                 ; $D4CC  4C A1 D4

_func_d4cf:
  ldx z:_var_002b                ; $D4CF  A6 2B
  lda z:_var_00db_indexed        ; $D4D1  A5 DB
  clc                            ; $D4D3  18
  adc a:_data_d7e5_indexed,X     ; $D4D4  7D E5 D7
  sta z:_var_00db_indexed        ; $D4D7  85 DB
  lda z:_var_00dc                ; $D4D9  A5 DC
  adc a:_data_d7e9_indexed,X     ; $D4DB  7D E9 D7
  sta z:_var_00dc                ; $D4DE  85 DC
  lda z:_var_00dd_indexed        ; $D4E0  A5 DD
  clc                            ; $D4E2  18
  adc a:_data_d7e5_indexed,X     ; $D4E3  7D E5 D7
  sta z:_var_00dd_indexed        ; $D4E6  85 DD
  lda z:_var_00de                ; $D4E8  A5 DE
  adc a:_data_d7e9_indexed,X     ; $D4EA  7D E9 D7
  sta z:_var_00de                ; $D4ED  85 DE
  rts                            ; $D4EF  60

_func_d4f0:
  jsr _func_de30                 ; $D4F0  20 30 DE
  jsr _func_d386                 ; $D4F3  20 86 D3
  stx z:_var_003a                ; $D4F6  86 3A
  lda z:_var_tableUpperOrLower                ; $D4F8  A5 BF
  asl a                          ; $D4FA  0A
  adc z:_var_003a                ; $D4FB  65 3A
  sta z:_var_003b                ; $D4FD  85 3B
  txa                            ; $D4FF  8A
  eor #$01                       ; $D500  49 01
  tax                            ; $D502  AA
  lda #$00                       ; $D503  A9 00
  sta z:_var_00c7_indexed,X      ; $D505  95 C7
  ldx z:_var_003a                ; $D507  A6 3A
  ldy z:_var_00c0_indexed,X      ; $D509  B4 C0
  sty z:_var_003e                ; $D50B  84 3E
  ldx z:_var_003b                ; $D50D  A6 3B
  lda a:_data_d9ea_indexed,X     ; $D50F  BD EA D9
  clc                            ; $D512  18
  adc a:_data_d9ee_indexed,Y     ; $D513  79 EE D9
  clc                            ; $D516  18
  adc a:_data_da4e_indexed,Y     ; $D517  79 4E DA
  sta z:_var_000c                ; $D51A  85 0C
  sec                            ; $D51C  38
  sbc z:_var_0009                ; $D51D  E5 09
  bpl _label_d528                ; $D51F  10 07
  sta z:_var_0010                ; $D521  85 10
  lda #$00                       ; $D523  A9 00
  sec                            ; $D525  38
  sbc z:_var_0010                ; $D526  E5 10

_label_d528:
  cmp #$07                       ; $D528  C9 07
  bcc _label_d52f                ; $D52A  90 03
  jmp _label_d5d1                ; $D52C  4C D1 D5

_label_d52f:
  sta z:_var_0008                ; $D52F  85 08
  lda a:_data_d9e0_indexed,X     ; $D531  BD E0 D9
  clc                            ; $D534  18
  ldx z:_var_003a                ; $D535  A6 3A
  bne _label_d53e                ; $D537  D0 05
  adc a:_data_da1e_indexed,Y     ; $D539  79 1E DA
  bcc _label_d544                ; $D53C  90 06

_label_d53e:
  adc #$1F                       ; $D53E  69 1F
  sec                            ; $D540  38
  sbc a:_data_da1e_indexed,Y     ; $D541  F9 1E DA

_label_d544:
  sta z:_var_000a_indexed        ; $D544  85 0A
  sec                            ; $D546  38
  sbc z:_var_0007_indexed        ; $D547  E5 07
  tax                            ; $D549  AA
  bpl _label_d553                ; $D54A  10 07
  sta z:_var_000e                ; $D54C  85 0E
  lda #$00                       ; $D54E  A9 00
  sec                            ; $D550  38
  sbc z:_var_000e                ; $D551  E5 0E

_label_d553:
  cmp #$07                       ; $D553  C9 07
  bcs _label_d5d1                ; $D555  B0 7A
  sta z:_var_0006_indexed        ; $D557  85 06
  txa                            ; $D559  8A
  rol a                          ; $D55A  2A
  rol a                          ; $D55B  2A
  and #$01                       ; $D55C  29 01
  eor z:_var_003a                ; $D55E  45 3A
  beq _label_d5d1                ; $D560  F0 6F
  jsr _func_dbfa                 ; $D562  20 FA DB
  lda z:_var_0006_indexed        ; $D565  A5 06
  clc                            ; $D567  18
  adc z:_var_0008                ; $D568  65 08
  tax                            ; $D56A  AA
  lda z:_var_0007_indexed        ; $D56B  A5 07
  clc                            ; $D56D  18
  adc z:_var_0009                ; $D56E  65 09
  sta z:_var_0007_indexed        ; $D570  85 07
  txa                            ; $D572  8A
  cmp #$31                       ; $D573  C9 31
  lda z:_var_0007_indexed        ; $D575  A5 07
  sbc #$00                       ; $D577  E9 00
  bcs _label_d5d1                ; $D579  B0 56
  ldx z:_var_003a                ; $D57B  A6 3A
  lda z:_var_00c7_indexed,X      ; $D57D  B5 C7
  bne _label_d5d7                ; $D57F  D0 56
  jsr _func_de30                 ; $D581  20 30 DE
  lda z:_var_0007_indexed        ; $D584  A5 07
  sec                            ; $D586  38
  sbc z:_var_000a_indexed        ; $D587  E5 0A
  sta z:_var_0006_indexed        ; $D589  85 06
  lda z:_var_0009                ; $D58B  A5 09
  sec                            ; $D58D  38
  sbc z:_var_000c                ; $D58E  E5 0C
  sta z:_var_0008                ; $D590  85 08
  jsr _func_dc3e                 ; $D592  20 3E DC
  sec                            ; $D595  38
  sbc #$40                       ; $D596  E9 40
  sta z:_var_0030                ; $D598  85 30
  jsr _func_d739                 ; $D59A  20 39 D7
  sec                            ; $D59D  38
  sbc z:_var_0030                ; $D59E  E5 30
  jsr _func_dd75                 ; $D5A0  20 75 DD
  lsr a                          ; $D5A3  4A
  lsr a                          ; $D5A4  4A
  lsr a                          ; $D5A5  4A
  sta z:_var_003f                ; $D5A6  85 3F
  lda z:_var_0030                ; $D5A8  A5 30
  jsr _func_d5c1                 ; $D5AA  20 C1 D5
  lda #$00                       ; $D5AD  A9 00
  sta z:_var_003c                ; $D5AF  85 3C
  lda #$02                       ; $D5B1  A9 02
  sta z:_var_0031                ; $D5B3  85 31
  jsr _func_d6a8                 ; $D5B5  20 A8 D6
  bcs _label_d5d7                ; $D5B8  B0 1D
  ldx z:_var_003a                ; $D5BA  A6 3A
  lda z:_var_0040                ; $D5BC  A5 40
  sta z:_var_00c7_indexed,X      ; $D5BE  95 C7
  rts                            ; $D5C0  60

_func_d5c1:
  ldx #$04                       ; $D5C1  A2 04

_label_d5c3:
  cmp a:_data_dad5_indexed,X     ; $D5C3  DD D5 DA
  bcs _label_d5cb                ; $D5C6  B0 03
  dex                            ; $D5C8  CA
  bpl _label_d5c3                ; $D5C9  10 F8

_label_d5cb:
  lda a:_data_dada_indexed,X     ; $D5CB  BD DA DA
  sta z:_var_0025                ; $D5CE  85 25
  rts                            ; $D5D0  60

_label_d5d1:
  ldx z:_var_003a                ; $D5D1  A6 3A
  lda #$00                       ; $D5D3  A9 00
  sta z:_var_00c7_indexed,X      ; $D5D5  95 C7

_label_d5d7:
  jsr _func_de30                 ; $D5D7  20 30 DE
  ldx z:_var_003b                ; $D5DA  A6 3B
  lda z:_var_0009                ; $D5DC  A5 09
  sec                            ; $D5DE  38
  sbc a:_data_d9e6_indexed,X     ; $D5DF  FD E6 D9
  cmp #$28                       ; $D5E2  C9 28
  bcs _label_d5f0                ; $D5E4  B0 0A
  lda z:_var_0007_indexed        ; $D5E6  A5 07
  sec                            ; $D5E8  38
  sbc a:_data_d9e0_indexed,X     ; $D5E9  FD E0 D9
  cmp #$20                       ; $D5EC  C9 20
  bcc _label_d5f1                ; $D5EE  90 01

_label_d5f0:
  rts                            ; $D5F0  60

_label_d5f1:
  lda #$00                       ; $D5F1  A9 00
  sta z:_var_003c                ; $D5F3  85 3C

_label_d5f5:
  jsr _func_de30                 ; $D5F5  20 30 DE
  lda z:_var_003a                ; $D5F8  A5 3A
  asl a                          ; $D5FA  0A
  adc z:_var_003c                ; $D5FB  65 3C
  sta z:_var_003d                ; $D5FD  85 3D
  ldy z:_var_003c                ; $D5FF  A4 3C
  ldx z:_var_003a                ; $D601  A6 3A
  lda z:_var_00c0_indexed,X      ; $D603  B5 C0
  adc a:_data_da7e_indexed,Y     ; $D605  79 7E DA
  sta z:_var_003e                ; $D608  85 3E
  ldx z:_var_003b                ; $D60A  A6 3B
  tay                            ; $D60C  A8
  lda z:_var_0007_indexed        ; $D60D  A5 07
  sec                            ; $D60F  38
  sbc a:_data_d9e0_indexed,X     ; $D610  FD E0 D9
  ldx z:_var_003a                ; $D613  A6 3A
  beq _label_d61a                ; $D615  F0 03
  sec                            ; $D617  38
  sbc #$1F                       ; $D618  E9 1F

_label_d61a:
  sta z:_var_0008                ; $D61A  85 08
  sta z:_var_000f                ; $D61C  85 0F
  ldx z:_var_003b                ; $D61E  A6 3B
  lda z:_var_0009                ; $D620  A5 09
  sec                            ; $D622  38
  sbc a:_data_d9ea_indexed,X     ; $D623  FD EA D9
  sec                            ; $D626  38
  sbc a:_data_d9ee_indexed,Y     ; $D627  F9 EE D9
  sta z:_var_0010                ; $D62A  85 10
  sta z:_var_0011                ; $D62C  85 11
  ldx z:_var_003e                ; $D62E  A6 3E
  sec                            ; $D630  38
  ldy z:_var_003a                ; $D631  A4 3A
  bne _label_d63a                ; $D633  D0 05
  lda a:_data_da1e_indexed,X     ; $D635  BD 1E DA
  bcs _label_d63f                ; $D638  B0 05

_label_d63a:
  lda #$00                       ; $D63A  A9 00
  sbc a:_data_da1e_indexed,X     ; $D63C  FD 1E DA

_label_d63f:
  sta z:_var_000e                ; $D63F  85 0E
  lda a:_data_da4e_indexed,X     ; $D641  BD 4E DA
  sta z:_var_0006_indexed        ; $D644  85 06
  jsr _func_dce3                 ; $D646  20 E3 DC
  jsr _func_ddf1                 ; $D649  20 F1 DD
  jsr _func_ddbe                 ; $D64C  20 BE DD
  jsr _func_dce3                 ; $D64F  20 E3 DC
  lda z:_var_0006_indexed        ; $D652  A5 06
  sec                            ; $D654  38
  sbc z:_var_000a_indexed        ; $D655  E5 0A
  sta z:_var_0006_indexed        ; $D657  85 06
  lda z:_var_0007_indexed        ; $D659  A5 07
  sbc z:_var_000b_indexed        ; $D65B  E5 0B
  sta z:_var_0007_indexed        ; $D65D  85 07
  jsr _func_dbc8                 ; $D65F  20 C8 DB
  lda z:_var_0006_indexed        ; $D662  A5 06
  cmp #$E0                       ; $D664  C9 E0
  lda z:_var_0007_indexed        ; $D666  A5 07
  sbc #$00                       ; $D668  E9 00
  bcc _label_d678                ; $D66A  90 0C

_label_d66c:
  inc z:_var_003c                ; $D66C  E6 3C
  lda z:_var_003c                ; $D66E  A5 3C
  cmp #$02                       ; $D670  C9 02
  bcs _label_d677                ; $D672  B0 03
  jmp _label_d5f5                ; $D674  4C F5 D5

_label_d677:
  rts                            ; $D677  60

_label_d678:
  jsr _func_d739                 ; $D678  20 39 D7
  sta z:_var_0030                ; $D67B  85 30
  lda z:_var_000f                ; $D67D  A5 0F
  sta z:_var_0006_indexed        ; $D67F  85 06
  lda z:_var_0011                ; $D681  A5 11
  sta z:_var_0008                ; $D683  85 08
  jsr _func_dc3e                 ; $D685  20 3E DC
  sec                            ; $D688  38
  sbc z:_var_0030                ; $D689  E5 30
  cmp #$81                       ; $D68B  C9 81
  bcs _label_d66c                ; $D68D  B0 DD
  lda z:_var_000f                ; $D68F  A5 0F
  bpl _label_d69a                ; $D691  10 07
  sta z:_var_0006_indexed        ; $D693  85 06
  lda #$00                       ; $D695  A9 00
  sec                            ; $D697  38
  sbc z:_var_0006_indexed        ; $D698  E5 06

_label_d69a:
  tax                            ; $D69A  AA
  lda a:_data_dab2_indexed,X     ; $D69B  BD B2 DA
  sta z:_var_003f                ; $D69E  85 3F
  lda z:_var_003c                ; $D6A0  A5 3C
  sta z:_var_0025                ; $D6A2  85 25
  lda #$01                       ; $D6A4  A9 01
  sta z:_var_0031                ; $D6A6  85 31

_func_d6a8:
  ldx z:_var_003a                ; $D6A8  A6 3A
  lda z:_var_00c2_indexed,X      ; $D6AA  B5 C2
  sta z:_var_0040                ; $D6AC  85 40
  bne _label_d6cb                ; $D6AE  D0 1B
  jsr _func_d0e0                 ; $D6B0  20 E0 D0
  bcs _label_d70f                ; $D6B3  B0 5A
  jsr _func_d159                 ; $D6B5  20 59 D1
  jsr _func_d730                 ; $D6B8  20 30 D7
  lda z:_var_0031                ; $D6BB  A5 31
  cmp #$02                       ; $D6BD  C9 02
  bne _label_d6c3                ; $D6BF  D0 02
  lsr z:_var_0036                ; $D6C1  46 36

_label_d6c3:
  lsr z:_var_0036                ; $D6C3  46 36
  jsr _func_d2e9                 ; $D6C5  20 E9 D2
  jmp _label_d359                ; $D6C8  4C 59 D3

_label_d6cb:
  jsr _func_de63                 ; $D6CB  20 63 DE
  jsr _func_dc3e                 ; $D6CE  20 3E DC
  sta z:_var_0034                ; $D6D1  85 34
  lda z:_var_0030                ; $D6D3  A5 30
  sec                            ; $D6D5  38
  sbc z:_var_0034                ; $D6D6  E5 34
  sta z:_var_0033                ; $D6D8  85 33
  jsr _func_de63                 ; $D6DA  20 63 DE
  jsr _func_dcaa                 ; $D6DD  20 AA DC
  sta z:_var_0035                ; $D6E0  85 35
  jsr _func_d15b                 ; $D6E2  20 5B D1
  jsr _func_d730                 ; $D6E5  20 30 D7
  lda z:_var_0036                ; $D6E8  A5 36
  lda z:_var_0033                ; $D6EA  A5 33
  bpl _label_d6f5                ; $D6EC  10 07
  lda #$00                       ; $D6EE  A9 00
  sec                            ; $D6F0  38
  sbc z:_var_0036                ; $D6F1  E5 36
  sta z:_var_0036                ; $D6F3  85 36

_label_d6f5:
  lda z:_var_0040                ; $D6F5  A5 40
  and #$02                       ; $D6F7  29 02
  ora z:_var_003c                ; $D6F9  05 3C
  tay                            ; $D6FB  A8
  lda z:_var_003f                ; $D6FC  A5 3F
  ldx a:_data_dade_indexed,Y     ; $D6FE  BE DE DA
  bmi _label_d710                ; $D701  30 0D
  clc                            ; $D703  18
  adc z:_var_0036                ; $D704  65 36
  bvc _label_d70c                ; $D706  50 04
  lda #$7F                       ; $D708  A9 7F
  bne _label_d71f                ; $D70A  D0 13

_label_d70c:
  bpl _label_d71f                ; $D70C  10 11

_label_d70e:
  sec                            ; $D70E  38

_label_d70f:
  rts                            ; $D70F  60

_label_d710:
  sta z:_var_00e3                ; $D710  85 E3
  lda z:_var_0036                ; $D712  A5 36
  sec                            ; $D714  38
  sbc z:_var_00e3                ; $D715  E5 E3
  bvs _label_d70e                ; $D717  70 F5
  bmi _label_d70e                ; $D719  30 F3
  lda #$00                       ; $D71B  A9 00
  beq _label_d728                ; $D71D  F0 09

_label_d71f:
  ldx z:_var_0031                ; $D71F  A6 31
  cpx #$02                       ; $D721  E0 02
  bne _label_d726                ; $D723  D0 01
  lsr a                          ; $D725  4A

_label_d726:
  adc z:_var_003f                ; $D726  65 3F

_label_d728:
  sta z:_var_0036                ; $D728  85 36
  jsr _func_d2e9                 ; $D72A  20 E9 D2
  jmp _func_de75                 ; $D72D  4C 75 DE

_func_d730:
  lda z:_var_0035                ; $D730  A5 35
  cmp #$0F                       ; $D732  C9 0F
  bcc _label_d738                ; $D734  90 02
  lsr z:_var_0037                ; $D736  46 37

_label_d738:
  rts                            ; $D738  60

_func_d739:
  ldx z:_var_003e                ; $D739  A6 3E
  sec                            ; $D73B  38
  lda z:_var_003a                ; $D73C  A5 3A
  bne _label_d744                ; $D73E  D0 04
  lda a:_data_da82_indexed,X     ; $D740  BD 82 DA
  rts                            ; $D743  60

_label_d744:
  lda #$00                       ; $D744  A9 00
  sec                            ; $D746  38
  sbc a:_data_da82_indexed,X     ; $D747  FD 82 DA
  rts                            ; $D74A  60

_data_d74b_indexed:
.byte $00, $20, $40, $01, $21, $41, $02, $22, $42 ; $D74B

_data_d754_indexed:
.byte $00, $06, $0e, $12, $16, $1a, $1e, $22, $26, $2a, $2e, $32, $3a ; $D754

_data_d761_indexed:
.byte $05                        ; $D761

_data_d762_indexed:
.byte $09, $06, $08, $07, $07, $03, $0b, $04, $0a, $08, $06, $09, $05, $02, $0c, $0a ; $D762
.byte $04, $01, $0d, $0b, $03, $01, $0e, $0b, $02, $00, $0f, $0c, $01, $00, $10, $0c ; $D772
.byte $00, $00, $11, $0c, $1f, $01, $12, $0b, $1e, $01, $13, $0b, $1d, $02, $14, $0a ; $D782
.byte $1c, $03, $15, $04, $16, $08, $1a, $09, $1b, $05, $17, $06, $18, $07, $19 ; $D792

_data_d7a1_indexed:
.byte $00, $03, $06              ; $D7A1

_data_d7a4_indexed:
.byte $02, $01, $03, $00, $02    ; $D7A4

_data_d7a9_indexed:
.byte $06, $06, $05, $05, $04, $03, $02, $01 ; $D7A9

_data_d7b1_indexed:
.byte $00, $ff, $fe, $fd, $fc, $fb, $fb, $fa, $fa, $fa, $fb, $fb, $fc, $fd, $fe, $ff ; $D7B1
.byte $00, $01, $02, $03, $04, $05, $05, $06, $06, $06, $05, $05, $04, $03, $02, $01 ; $D7C1

_data_d7d1_indexed:
.byte $00, $00, $ff, $01         ; $D7D1

_data_d7d5_indexed:
.byte $ff, $01, $00, $00         ; $D7D5

_data_d7d9_indexed:
.byte $00, $80, $40, $c0         ; $D7D9

_data_d7dd_indexed:
.byte $80, $40, $20, $10, $08, $04, $02, $01 ; $D7DD

_data_d7e5_indexed:
.byte $01, $ff, $e0, $20         ; $D7E5

_data_d7e9_indexed:
.byte $00, $ff, $ff, $00         ; $D7E9

_data_d7ed_indexed:
.byte $fd, $46, $6d, $93, $b9, $de, $02, $1f ; $D7ED

_data_d7f5_indexed:
.byte $d7, $d8, $d8, $d8, $d8, $d8, $d9, $d8, $07, $18, $20, $40, $40, $80, $80, $80 ; $D7F5
.byte $40, $40, $20, $18, $07, $00, $c0, $20, $10, $10, $08, $08, $08, $10, $10, $20 ; $D805
.byte $c0, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $01 ; $D815
.byte $01, $01, $00, $00, $00, $00, $00, $0e, $31, $40, $80, $80, $00, $00, $00, $80 ; $D825
.byte $80, $40, $31, $0e, $00, $80, $40, $20, $20, $10, $10, $10, $20, $20, $40, $80 ; $D835
.byte $00, $03, $0c, $10, $20, $20, $40, $40, $40, $20, $20, $10, $0c, $03, $80, $60 ; $D845
.byte $10, $08, $08, $04, $04, $04, $08, $08, $10, $60, $80, $00, $00, $00, $00, $00 ; $D855
.byte $00, $00, $00, $00, $00, $00, $00, $00, $01, $06, $08, $10, $10, $20, $20, $20 ; $D865
.byte $10, $10, $08, $06, $01, $c0, $30, $08, $04, $04, $02, $02, $02, $04, $04, $08 ; $D875
.byte $30, $c0, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $03 ; $D885
.byte $04, $08, $08, $10, $10, $10, $08, $08, $04, $03, $00, $e0, $18, $04, $02, $02 ; $D895
.byte $01, $01, $01, $02, $02, $04, $18, $e0, $00, $00, $00, $00, $00, $00, $00, $00 ; $D8A5
.byte $00, $00, $00, $00, $00, $01, $02, $04, $04, $08, $08, $08, $04, $04, $02, $01 ; $D8B5
.byte $00, $70, $8c, $02, $01, $01, $00, $00, $00, $01, $01, $02, $8c, $70, $00, $00 ; $D8C5
.byte $00, $00, $00, $80, $80, $80, $00, $00, $00, $00, $00, $01, $02, $02, $04, $04 ; $D8D5
.byte $04, $02, $02, $01, $00, $00, $38, $c6, $01, $00, $00, $00, $00, $00, $00, $00 ; $D8E5
.byte $01, $c6, $38, $00, $00, $00, $80, $80, $40, $40, $40, $80, $80, $00, $00, $00 ; $D8F5
.byte $01, $01, $02, $02, $02, $01, $01, $00, $00, $00, $1c, $63, $80, $00, $00, $00 ; $D905
.byte $00, $00, $00, $00, $80, $63, $1c, $00, $00, $80, $40, $40, $20, $20, $20, $40 ; $D915
.byte $40, $80, $00              ; $D925

_data_d928_indexed:
.byte $00, $20, $13, $0d, $0a, $08, $07, $06, $05, $05, $04, $04, $03, $03, $03, $03 ; $D928
.byte $03, $02, $02, $02, $02, $02, $02, $02, $02, $02, $02, $02, $01 ; $D938

_data_d945_indexed:
.byte $36, $41, $4a, $4d, $53, $61, $6a, $73, $76, $81, $8a, $8d, $93, $a1, $aa, $b3 ; $D945
.byte $b6, $c1, $ca, $cd, $d3, $e1, $ea, $f3, $f6, $01, $0a, $0d, $13, $21, $2a, $33 ; $D955

_data_d965_indexed:
.byte $14, $0c, $0c, $12, $1a, $12, $0c, $0c ; $D965

_data_d96d_indexed:
.byte $40, $47, $50, $56, $60, $6a, $70, $79, $80, $87, $90, $96, $a0, $aa, $b0, $b9 ; $D96D
.byte $c0, $c7, $d0, $d6, $e0, $ea, $f0, $f9, $00, $07, $10, $16, $20, $2a, $30, $39 ; $D97D

_data_d98d_indexed:
.byte $00, $06, $0e              ; $D98D

_data_d990_indexed:
.byte $2a, $2b, $2c, $2d, $2e, $00, $be, $c2, $c9, $bc, $c0, $c5, $2a, $00, $dc, $a1 ; $D990
.byte $e5, $e9, $a4, $6c, $e8, $ec, $00 ; $D9A0

_data_d9a7_indexed:
.byte $7e, $96, $ff, $ff, $8a, $a2, $ff, $ff ; $D9A7

_data_d9af_indexed:
.byte $f0, $fc                   ; $D9AF

_data_d9b1_indexed:
.byte $5f, $b9, $c1              ; $D9B1

_data_d9b4_indexed:
.byte $10, $10, $16              ; $D9B4

_data_d9b7_indexed:
.byte $8c, $98, $19              ; $D9B7

_data_d9ba_indexed:
.byte $04, $04, $06              ; $D9BA

_data_d9bd_indexed:
.byte $c0, $40, $60              ; $D9BD

_data_d9c0_indexed:
.byte $10, $07                   ; $D9C0

; offsets for scoring table (incl. upper table 100 diagonal)
_data_d9c2_indexed:
.byte $0a, $0f, $14, $19, $1e, $23, $28, $2d, $32, $37 ; $D9C2

_data_d9cc_indexed:
.byte $06, $06, $00, $00, $00    ; $D9CC

_data_d9d1_indexed:
.byte $c9, $cc, $d6, $e3, $e3    ; $D9D1

; offsets for scoring table (incl. upper table 10 (below-left of 100 diagonal, lime bar)
; incl. lower table 100 gold bumper
_data_d9d6_indexed:
.byte $0a, $00, $46, $46, $46    ; $D9D6

_data_d9db_indexed:
.byte $1f, $1f, $3f, $3f, $3f    ; $D9DB

_data_d9e0_indexed:
.byte $68, $98, $68, $98, $00, $00 ; $D9E0

_data_d9e6_indexed:
.byte $b8, $b8, $b0, $b0         ; $D9E6

_data_d9ea_indexed:
.byte $c0, $c0, $b8, $b8         ; $D9EA

_data_d9ee_indexed:
.byte $07, $07, $07, $07, $07, $07, $07, $07, $07, $07, $07, $07, $07, $07, $07, $08 ; $D9EE
.byte $08, $08, $08, $08, $08, $08, $09, $09, $10, $10, $11, $11, $11, $11, $11, $11 ; $D9FE
.byte $11, $11, $12, $12, $12, $12, $12, $12, $12, $12, $12, $12, $12, $12, $12, $12 ; $DA0E

_data_da1e_indexed:
.byte $1c, $1d, $1d, $1d, $1e, $1e, $1e, $1e, $1f, $1f, $1f, $1f, $1f, $1f, $1f, $1f ; $DA1E
.byte $1f, $1f, $1f, $1f, $1f, $1f, $1e, $1e, $1e, $1e, $1f, $1f, $1f, $1f, $1f, $1f ; $DA2E
.byte $1f, $1f, $1f, $1f, $1f, $1f, $1f, $1f, $1e, $1e, $1e, $1e, $1d, $1d, $1d, $1c ; $DA3E

_data_da4e_indexed:
.byte $11, $10, $0f, $0e, $0c, $0b, $0a, $09, $08, $07, $06, $05, $04, $03, $02, $00 ; $DA4E
.byte $ff, $fe, $fd, $fc, $fb, $fa, $f8, $f7, $09, $08, $06, $05, $04, $03, $02, $01 ; $DA5E
.byte $00, $fe, $fd, $fc, $fb, $fa, $f9, $f8, $f7, $f6, $f5, $f4, $f3, $f2, $f1, $f0 ; $DA6E

_data_da7e_indexed:
.byte $00, $18, $30, $48         ; $DA7E

_data_da82_indexed:
.byte $ed, $ee, $f0, $f1, $f3, $f4, $f5, $f7, $f8, $f9, $fb, $fc, $fd, $ff, $00, $03 ; $DA82
.byte $04, $05, $06, $08, $09, $0a, $0d, $0e, $78, $79, $7c, $7d, $7e, $80, $81, $82 ; $DA92
.byte $83, $86, $87, $89, $8a, $8b, $8d, $8e, $8f, $91, $92, $93, $95, $96, $98, $99 ; $DAA2

_data_dab2_indexed:
.byte $04, $08, $0c, $10, $14, $18, $1c, $20, $22, $24, $26, $28, $2a, $2c, $2e, $30 ; $DAB2
.byte $32, $32, $34, $34, $36, $36, $38, $38, $3a, $3a, $3c, $3c, $3e, $3e, $3e, $3e ; $DAC2
.byte $3e, $3e, $3e              ; $DAD2

_data_dad5_indexed:
.byte $00, $20, $60, $a0, $e0    ; $DAD5

_data_dada_indexed:
.byte $00, $02, $01, $03         ; $DADA

_data_dade_indexed:
.byte $00, $ff, $ff              ; $DADE

_data_dae1_indexed:
.byte $00, $05, $0b              ; $DAE1

_data_dae4_indexed:
.byte $3f, $27, $63, $ad, $ff, $37, $90, $19, $a0, $b0, $ff, $52, $62, $72, $82, $ff ; $DAE4

_data_daf4_indexed:
.byte $42, $68, $66, $be, $ff, $3a, $a0, $2e, $a3, $b3, $ff, $5d, $6d, $7d, $8d, $ff ; $DAF4

_data_db04_indexed:
.byte $00, $05, $08, $0b, $ff, $0e, $15, $1c, $1f, $24, $ff, $29, $29, $29, $29, $ff ; $DB04

_data_db14_indexed:
.byte $78, $88, $98, $a8, $ff, $48, $60, $ff, $c8, $d4, $ff, $ca, $d7, $ff, $68, $78 ; $DB14
.byte $88, $98, $a8, $b8, $ff, $78, $80, $8c, $9c, $a0, $a8, $ff, $ca, $d6, $ff, $54 ; $DB24
.byte $61, $be, $cb, $ff, $48, $54, $cb, $d7, $ff, $83, $8e, $93, $9e, $a3, $ae, $ff ; $DB34

_data_db44_indexed:
.byte $00, $01, $01, $01, $00, $00, $02, $00, $00, $03, $00, $00, $04, $00, $00, $05 ; $DB44
.byte $05, $05, $05, $05, $00, $00, $06, $00, $06, $00, $06, $00, $00, $07, $00, $00 ; $DB54
.byte $08, $00, $08, $00, $00, $09, $00, $09, $00, $00, $0a, $00, $0a, $00, $0a, $00 ; $DB64

_data_db74_indexed:
.byte $a5, $b5, $d6, $e4, $19, $3b, $e7, $48, $55, $5d ; $DB74

_data_db7e_indexed:
.byte $cd, $cd, $cd, $cd, $ce, $ce, $cd, $ce, $ce, $ce ; $DB7E

; offsets for scoring table (incl. upper table 500,1000,500 chutes, 100 bumper)
_data_db88_indexed:
.byte $1e, $37, $1e, $27, $2a, $32, $3a, $43, $4b, $54, $5d, $65 ; $DB88

_data_db94_indexed:
.byte $00                        ; $DB94

_data_db95_indexed:
.byte $14, $01, $14, $02, $14, $03, $14, $04, $78, $80, $03, $0a, $02, $0a, $01, $0a ; $DB95
.byte $00, $01, $ff              ; $DBA5

_data_dba8_indexed:
.byte $00, $02                   ; $DBA8

_data_dbaa_indexed:
.byte $00, $01                   ; $DBAA

_data_dbac_indexed:
.byte $00, $03                   ; $DBAC

_data_dbae_indexed:
.byte $d0, $d0, $98, $e2         ; $DBAE

_data_dbb2_indexed:
.byte $b3, $1f, $a0, $99         ; $DBB2

_func_dbb6:
  ldx #$02                       ; $DBB6  A2 02

_label_dbb8:
  lda z:_var_000a_indexed,X      ; $DBB8  B5 0A
  eor #$80                       ; $DBBA  49 80
  asl a                          ; $DBBC  0A
  sta z:_var_0012                ; $DBBD  85 12
  sbc z:_var_0012                ; $DBBF  E5 12
  sta z:_var_000b_indexed,X      ; $DBC1  95 0B
  dex                            ; $DBC3  CA
  dex                            ; $DBC4  CA
  bpl _label_dbb8                ; $DBC5  10 F1
  rts                            ; $DBC7  60

_func_dbc8:
  ldx #$00                       ; $DBC8  A2 00
  bit a:$02A2                    ; $DBCA  2C A2 02

_label_dbcd:
  lda z:_var_0007_indexed,X      ; $DBCD  B5 07
  bpl _label_dbde                ; $DBCF  10 0D
  lda #$00                       ; $DBD1  A9 00
  sec                            ; $DBD3  38
  sbc z:_var_0006_indexed,X      ; $DBD4  F5 06
  sta z:_var_0006_indexed,X      ; $DBD6  95 06
  lda #$00                       ; $DBD8  A9 00
  sbc z:_var_0007_indexed,X      ; $DBDA  F5 07
  sta z:_var_0007_indexed,X      ; $DBDC  95 07

_label_dbde:
  dex                            ; $DBDE  CA
  dex                            ; $DBDF  CA
  bpl _label_dbcd                ; $DBE0  10 EB
  rts                            ; $DBE2  60

_func_dbe3:
  lda z:_var_0006_indexed        ; $DBE3  A5 06
  bpl _label_dbee                ; $DBE5  10 07
  lda #$00                       ; $DBE7  A9 00
  sec                            ; $DBE9  38
  sbc z:_var_0006_indexed        ; $DBEA  E5 06
  sta z:_var_0006_indexed        ; $DBEC  85 06

_label_dbee:
  lda z:_var_0008                ; $DBEE  A5 08
  bpl _label_dbf9                ; $DBF0  10 07
  lda #$00                       ; $DBF2  A9 00
  sec                            ; $DBF4  38
  sbc z:_var_0008                ; $DBF5  E5 08
  sta z:_var_0008                ; $DBF7  85 08

_label_dbf9:
  rts                            ; $DBF9  60

_func_dbfa:
  ldx #$02                       ; $DBFA  A2 02

_label_dbfc:
  ldy z:_var_0006_indexed,X      ; $DBFC  B4 06
  lda a:_var_0300_indexed,Y      ; $DBFE  B9 00 03
  sta z:_var_0006_indexed,X      ; $DC01  95 06
  lda a:_data_de87_indexed,Y     ; $DC03  B9 87 DE
  sta z:_var_0007_indexed,X      ; $DC06  95 07
  dex                            ; $DC08  CA
  dex                            ; $DC09  CA
  bpl _label_dbfc                ; $DC0A  10 F0
  rts                            ; $DC0C  60

_func_dc0d:
  ldx #$80                       ; $DC0D  A2 80
  stx z:_var_0012                ; $DC0F  86 12

_label_dc11:
  lsr z:_var_0012                ; $DC11  46 12
  lda a:_var_0300_indexed,X      ; $DC13  BD 00 03
  sec                            ; $DC16  38
  sbc z:_var_0006_indexed        ; $DC17  E5 06
  sta z:_var_0013                ; $DC19  85 13
  lda a:_data_de87_indexed,X     ; $DC1B  BD 87 DE
  sbc z:_var_0007_indexed        ; $DC1E  E5 07
  ora z:_var_0013                ; $DC20  05 13
  beq _label_dc37                ; $DC22  F0 13
  lda z:_var_0012                ; $DC24  A5 12
  beq _label_dc34                ; $DC26  F0 0C
  txa                            ; $DC28  8A
  bcs _label_dc2e                ; $DC29  B0 03
  adc z:_var_0012                ; $DC2B  65 12
.byte $2c                        ; $DC2D  2C  branch into instruction detected: bit a:$12E5

_label_dc2e:
.byte $e5, $12                   ; $DC2E  E5 12
  tax                            ; $DC30  AA
  jmp _label_dc11                ; $DC31  4C 11 DC

_label_dc34:
  bcc _label_dc37                ; $DC34  90 01
  dex                            ; $DC36  CA

_label_dc37:
  stx z:_var_0006_indexed        ; $DC37  86 06
  lda #$00                       ; $DC39  A9 00
  sta z:_var_0007_indexed        ; $DC3B  85 07
  rts                            ; $DC3D  60

_func_dc3e:
  lda z:_var_0006_indexed        ; $DC3E  A5 06
  asl a                          ; $DC40  0A
  lda z:_var_0008                ; $DC41  A5 08
  rol a                          ; $DC43  2A
  rol a                          ; $DC44  2A
  and #$03                       ; $DC45  29 03
  pha                            ; $DC47  48
  jsr _func_dbe3                 ; $DC48  20 E3 DB
  ldy #$00                       ; $DC4B  A0 00
  lda z:_var_0006_indexed        ; $DC4D  A5 06
  cmp z:_var_0008                ; $DC4F  C5 08
  bcc _label_dc5a                ; $DC51  90 07
  ldx z:_var_0008                ; $DC53  A6 08
  sta z:_var_0008                ; $DC55  85 08
  stx z:_var_0006_indexed        ; $DC57  86 06
  dey                            ; $DC59  88

_label_dc5a:
  sty z:_var_0014                ; $DC5A  84 14
  lda z:_var_0008                ; $DC5C  A5 08
  bne _label_dc64                ; $DC5E  D0 04
  pla                            ; $DC60  68
  lda #$40                       ; $DC61  A9 40
  rts                            ; $DC63  60

_label_dc64:
  cmp z:_var_0006_indexed        ; $DC64  C5 06
  bne _label_dc6c                ; $DC66  D0 04
  lda #$20                       ; $DC68  A9 20
  bne _label_dc8e                ; $DC6A  D0 22

_label_dc6c:
  jsr _func_dd5d                 ; $DC6C  20 5D DD
  lda z:_var_0006_indexed        ; $DC6F  A5 06
  and #$C0                       ; $DC71  29 C0
  lsr a                          ; $DC73  4A
  lsr a                          ; $DC74  4A
  lsr a                          ; $DC75  4A
  lsr a                          ; $DC76  4A
  tax                            ; $DC77  AA
  lda z:_var_0006_indexed        ; $DC78  A5 06

_label_dc7a:
  cmp a:_data_df87_indexed,X     ; $DC7A  DD 87 DF
  bcc _label_dc82                ; $DC7D  90 03
  inx                            ; $DC7F  E8
  bne _label_dc7a                ; $DC80  D0 F8

_label_dc82:
  txa                            ; $DC82  8A
  ldx z:_var_0014                ; $DC83  A6 14
  bne _label_dc8e                ; $DC85  D0 07
  sta z:_var_0012                ; $DC87  85 12
  lda #$40                       ; $DC89  A9 40
  sec                            ; $DC8B  38
  sbc z:_var_0012                ; $DC8C  E5 12

_label_dc8e:
  sta z:_var_0012                ; $DC8E  85 12
  pla                            ; $DC90  68
  tax                            ; $DC91  AA
  lda a:_data_dca2_indexed,X     ; $DC92  BD A2 DC
  ldy a:_data_dca6_indexed,X     ; $DC95  BC A6 DC
  bne _label_dc9e                ; $DC98  D0 04
  clc                            ; $DC9A  18
  adc z:_var_0012                ; $DC9B  65 12
  rts                            ; $DC9D  60

_label_dc9e:
  sec                            ; $DC9E  38
  sbc z:_var_0012                ; $DC9F  E5 12
  rts                            ; $DCA1  60

_data_dca2_indexed:
.byte $00, $00, $80, $80         ; $DCA2

_data_dca6_indexed:
.byte $ff, $00, $00, $ff         ; $DCA6

_func_dcaa:
  jsr _func_dbe3                 ; $DCAA  20 E3 DB
  jsr _func_dbfa                 ; $DCAD  20 FA DB
  lda z:_var_0006_indexed        ; $DCB0  A5 06
  clc                            ; $DCB2  18
  adc z:_var_0008                ; $DCB3  65 08
  sta z:_var_0006_indexed        ; $DCB5  85 06
  lda z:_var_0007_indexed        ; $DCB7  A5 07
  adc z:_var_0009                ; $DCB9  65 09
  sta z:_var_0007_indexed        ; $DCBB  85 07
  jsr _func_dc0d                 ; $DCBD  20 0D DC
  lda z:_var_0006_indexed        ; $DCC0  A5 06
  bpl _label_dcc8                ; $DCC2  10 04
  lda #$7F                       ; $DCC4  A9 7F
  sta z:_var_0006_indexed        ; $DCC6  85 06

_label_dcc8:
  rts                            ; $DCC8  60

_func_dcc9:
  ldx #$02                       ; $DCC9  A2 02

_label_dccb:
  lda z:_var_0006_indexed,X      ; $DCCB  B5 06
  clc                            ; $DCCD  18
  adc z:_var_000a_indexed,X      ; $DCCE  75 0A
  sta z:_var_0006_indexed,X      ; $DCD0  95 06
  lda z:_var_0007_indexed,X      ; $DCD2  B5 07
  adc z:_var_000b_indexed,X      ; $DCD4  75 0B
  sta z:_var_0007_indexed,X      ; $DCD6  95 07
  dex                            ; $DCD8  CA
  dex                            ; $DCD9  CA
  bpl _label_dccb                ; $DCDA  10 EF
  rts                            ; $DCDC  60

_func_dcdd:
  lda #$00                       ; $DCDD  A9 00
  sta z:_var_0012                ; $DCDF  85 12
  beq _func_dcec                 ; $DCE1  F0 09

_func_dce3:
  lda z:_var_0006_indexed        ; $DCE3  A5 06
  eor z:_var_0008                ; $DCE5  45 08
  sta z:_var_0012                ; $DCE7  85 12
  jsr _func_dbe3                 ; $DCE9  20 E3 DB

_func_dcec:
  lda z:_var_0008                ; $DCEC  A5 08
  cmp z:_var_0006_indexed        ; $DCEE  C5 06
  bcc _label_dcf9                ; $DCF0  90 07
  ldx z:_var_0006_indexed        ; $DCF2  A6 06
  sta z:_var_0006_indexed        ; $DCF4  85 06
  stx z:_var_0008                ; $DCF6  86 08
  txa                            ; $DCF8  8A

_label_dcf9:
  ldx #$08                       ; $DCF9  A2 08

_label_dcfb:
  asl a                          ; $DCFB  0A
  bcs _label_dd05                ; $DCFC  B0 07
  dex                            ; $DCFE  CA
  bne _label_dcfb                ; $DCFF  D0 FA
  sta z:_var_0007_indexed        ; $DD01  85 07
  beq _label_dd1e                ; $DD03  F0 19

_label_dd05:
  sta z:_var_0008                ; $DD05  85 08
  lda #$00                       ; $DD07  A9 00
  sta z:_var_0007_indexed        ; $DD09  85 07
  beq _label_dd14                ; $DD0B  F0 07

_label_dd0d:
  asl a                          ; $DD0D  0A
  rol z:_var_0007_indexed        ; $DD0E  26 07
  asl z:_var_0008                ; $DD10  06 08
  bcc _label_dd1b                ; $DD12  90 07

_label_dd14:
  clc                            ; $DD14  18
  adc z:_var_0006_indexed        ; $DD15  65 06
  bcc _label_dd1b                ; $DD17  90 02
  inc z:_var_0007_indexed        ; $DD19  E6 07

_label_dd1b:
  dex                            ; $DD1B  CA
  bne _label_dd0d                ; $DD1C  D0 EF

_label_dd1e:
  sta z:_var_0006_indexed        ; $DD1E  85 06
  lda z:_var_0012                ; $DD20  A5 12
  bpl _label_dd31                ; $DD22  10 0D
  lda #$00                       ; $DD24  A9 00
  sec                            ; $DD26  38
  sbc z:_var_0006_indexed        ; $DD27  E5 06
  sta z:_var_0006_indexed        ; $DD29  85 06
  lda #$00                       ; $DD2B  A9 00
  sbc z:_var_0007_indexed        ; $DD2D  E5 07
  sta z:_var_0007_indexed        ; $DD2F  85 07

_label_dd31:
  rts                            ; $DD31  60

_func_dd32:
  lda z:_var_0006_indexed        ; $DD32  A5 06
  eor z:_var_0009                ; $DD34  45 09
  sta z:_var_0012                ; $DD36  85 12
  lda z:_var_0006_indexed        ; $DD38  A5 06
  bpl _label_dd43                ; $DD3A  10 07
  lda #$00                       ; $DD3C  A9 00
  sec                            ; $DD3E  38
  sbc z:_var_0006_indexed        ; $DD3F  E5 06
  sta z:_var_0006_indexed        ; $DD41  85 06

_label_dd43:
  lda z:_var_0009                ; $DD43  A5 09
  bpl _label_dd4e                ; $DD45  10 07
  lda #$00                       ; $DD47  A9 00
  sec                            ; $DD49  38
  sbc z:_var_0008                ; $DD4A  E5 08
  sta z:_var_0008                ; $DD4C  85 08

_label_dd4e:
  jsr _func_dcec                 ; $DD4E  20 EC DC
  ldy #$00                       ; $DD51  A0 00
  lda z:_var_0007_indexed        ; $DD53  A5 07
  sta z:_var_0006_indexed        ; $DD55  85 06
  bpl _label_dd5a                ; $DD57  10 01
  dey                            ; $DD59  88

_label_dd5a:
  sty z:_var_0007_indexed        ; $DD5A  84 07
  rts                            ; $DD5C  60

_func_dd5d:
  lda z:_var_0006_indexed        ; $DD5D  A5 06
  ldx #$00                       ; $DD5F  A2 00
  stx z:_var_0006_indexed        ; $DD61  86 06
  ldx #$08                       ; $DD63  A2 08

_label_dd65:
  asl a                          ; $DD65  0A
  bcs _label_dd6c                ; $DD66  B0 04
  cmp z:_var_0008                ; $DD68  C5 08
  bcc _label_dd6f                ; $DD6A  90 03

_label_dd6c:
  sbc z:_var_0008                ; $DD6C  E5 08
  sec                            ; $DD6E  38

_label_dd6f:
  rol z:_var_0006_indexed        ; $DD6F  26 06
  dex                            ; $DD71  CA
  bne _label_dd65                ; $DD72  D0 F1
  rts                            ; $DD74  60

_func_dd75:
  sec                            ; $DD75  38
  sbc #$40                       ; $DD76  E9 40

_func_dd78:
  and #$7F                       ; $DD78  29 7F
  cmp #$40                       ; $DD7A  C9 40
  bcc _label_dd84                ; $DD7C  90 06
  sta z:_var_0012                ; $DD7E  85 12
  lda #$7F                       ; $DD80  A9 7F
  sbc z:_var_0012                ; $DD82  E5 12

_label_dd84:
  tax                            ; $DD84  AA
  lda a:_data_dfa8_indexed,X     ; $DD85  BD A8 DF
  sta z:_var_0008                ; $DD88  85 08
  ldy #$00                       ; $DD8A  A0 00
  sty z:_var_0009                ; $DD8C  84 09
  rts                            ; $DD8E  60

_func_dd8f:
  sec                            ; $DD8F  38
  sbc #$40                       ; $DD90  E9 40

_func_dd92:
  pha                            ; $DD92  48
  jsr _func_dd78                 ; $DD93  20 78 DD
  pla                            ; $DD96  68
  bmi _label_dda2                ; $DD97  30 09
  lda #$00                       ; $DD99  A9 00
  sec                            ; $DD9B  38
  sbc z:_var_0008                ; $DD9C  E5 08
  sta z:_var_0008                ; $DD9E  85 08
  dec z:_var_0009                ; $DDA0  C6 09

_label_dda2:
  rts                            ; $DDA2  60

_func_dda3:
  lda z:_var_0006_indexed        ; $DDA3  A5 06
  sta z:_var_000a_indexed        ; $DDA5  85 0A
  lda z:_var_0008                ; $DDA7  A5 08
  sta z:_var_000c                ; $DDA9  85 0C
  rts                            ; $DDAB  60

_func_ddac:
  lda z:_var_0006_indexed        ; $DDAC  A5 06
  sta z:_var_000e                ; $DDAE  85 0E
  lda z:_var_0008                ; $DDB0  A5 08
  sta z:_var_0010                ; $DDB2  85 10
  rts                            ; $DDB4  60

_func_ddb5:
  lda z:_var_000a_indexed        ; $DDB5  A5 0A
  sta z:_var_0006_indexed        ; $DDB7  85 06
  lda z:_var_000c                ; $DDB9  A5 0C
  sta z:_var_0008                ; $DDBB  85 08
  rts                            ; $DDBD  60

_func_ddbe:
  lda z:_var_000e                ; $DDBE  A5 0E
  sta z:_var_0006_indexed        ; $DDC0  85 06
  lda z:_var_0010                ; $DDC2  A5 10
  sta z:_var_0008                ; $DDC4  85 08
  rts                            ; $DDC6  60

_func_ddc7:
 lda z:_var_000a_indexed                ; $DDC7 A5 0A
 ldx z:_var_000b_indexed                ; $DDC9 A6 0B
 sta z:_var_0006_indexed                ; $DDCB 85 06
 stx z:_var_0007_indexed                ; $DDCD 86 07
 rts                    ; $DDCF 60

_func_ddd0:
 lda z:_var_000e                ; $DDD0 A5 0E
 ldx z:_var_000f                ; $DDD2 A6 0F
 sta z:_var_0006_indexed                ; $DDD4 85 06
 stx z:_var_0007_indexed                ; $DDD6 86 07
 rts                    ; $DDD8 60
 jsr _func_ddc7              ; $DDD9 20 C7 DD
 lda z:_var_000c                ; $DDDC A5 0C
 ldx z:_var_000d                ; $DDDE A6 0D
 sta z:_var_0008                ; $DDE0 85 08
 stx z:_var_0009                ; $DDE2 86 09
 rts                    ; $DDE4 60
 jsr _func_ddd0              ; $DDE5 20 D0 DD
 lda z:_var_0010                ; $DDE8 A5 10
 ldx z:_var_0011                ; $DDEA A6 11
 sta z:_var_0008                ; $DDEC 85 08
 stx z:_var_0009                ; $DDEE 86 09
 rts                    ; $DDF0 60
 
;.byte $a5, $0a, $a6, $0b, $85, $06, $86, $07, $60, $a5, $0e, $a6, $0f, $85, $06, $86 ; $DDC7
;.byte $07, $60, $20, $c7, $dd, $a5, $0c, $a6, $0d, $85, $08, $86, $09, $60, $20, $d0 ; $DDD7
;.byte $dd, $a5, $10, $a6, $11, $85, $08, $86, $09, $60 ; $DDE7

_func_ddf1:
  lda z:_var_0006_indexed        ; $DDF1  A5 06
  ldx z:_var_0007_indexed        ; $DDF3  A6 07
  sta z:_var_000a_indexed        ; $DDF5  85 0A
  stx z:_var_000b_indexed        ; $DDF7  86 0B
  rts                            ; $DDF9  60

_func_ddfa:
 lda z:_var_000e                ; $DDFA A5 0E
 ldx z:_var_000f                ; $DDFC A6 0F
 sta z:_var_000a_indexed                ; $DDFE 85 0A
 stx z:_var_000b_indexed                ; $DE00 86 0B
 rts                    ; $DE02 60
 jsr _func_ddf1              ; $DE03 20 F1 DD
 lda z:_var_0008                ; $DE06 A5 08
 ldx z:_var_0009                ; $DE08 A6 09
 sta z:_var_000c                ; $DE0A 85 0C
 stx z:_var_000d                ; $DE0C 86 0D
 rts                    ; $DE0E 60
 jsr _func_ddfa              ; $DE0F 20 FA DD
 lda z:_var_0010                ; $DE12 A5 10
 ldx z:_var_0011                ; $DE14 A6 11
 sta z:_var_000c                ; $DE16 85 0C
 stx z:_var_000d                ; $DE18 86 0D
 rts                    ; $DE1A 60

_func_de1b:
 lda z:_var_0006_indexed                ; $DE1B A5 06
 ldx z:_var_0007_indexed                ; $DE1D A6 07
 sta z:_var_000e                ; $DE1F 85 0E
 stx z:_var_000f                ; $DE21 86 0F
 rts                    ; $DE23 60
 jsr _func_de1b              ; $DE24 20 1B DE
 lda z:_var_0008                ; $DE27 A5 08
 ldx z:_var_0009                ; $DE29 A6 09
 sta z:_var_0010                ; $DE2B 85 10
 stx z:_var_0011                ; $DE2D 86 11
 rts                    ; $DE2F 60
 
;.byte $a5, $0e, $a6, $0f, $85, $0a, $86, $0b, $60, $20, $f1, $dd, $a5, $08, $a6, $09 ; $DDFA
;.byte $85, $0c, $86, $0d, $60, $20, $fa, $dd, $a5, $10, $a6, $11, $85, $0c, $86, $0d ; $DE0A
;.byte $60, $a5, $06, $a6, $07, $85, $0e, $86, $0f, $60, $20, $1b, $de, $a5, $08, $a6 ; $DE1A
;.byte $09, $85, $10, $86, $11, $60 ; $DE2A

_func_de30:
  lda z:_var_0015                ; $DE30  A5 15
  sta z:_var_0006_indexed        ; $DE32  85 06
  lda z:_var_0016                ; $DE34  A5 16
  sta z:_var_0007_indexed        ; $DE36  85 07
  lda z:_var_0017                ; $DE38  A5 17
  sta z:_var_0008                ; $DE3A  85 08
  lda z:_var_0018                ; $DE3C  A5 18
  sta z:_var_0009                ; $DE3E  85 09
  rts                            ; $DE40  60

_func_de41:
  lda z:_var_0006_indexed        ; $DE41  A5 06
  sta z:_var_0015                ; $DE43  85 15
  lda z:_var_0007_indexed        ; $DE45  A5 07
  sta z:_var_0016                ; $DE47  85 16
  lda z:_var_0008                ; $DE49  A5 08
  sta z:_var_0017                ; $DE4B  85 17
  lda z:_var_0009                ; $DE4D  A5 09
  sta z:_var_0018                ; $DE4F  85 18
  rts                            ; $DE51  60

_label_de52:
 lda z:_var_000a_indexed                ; $DE52 A5 0A
 sta z:_var_0015                ; $DE54 85 15
 lda z:_var_000b_indexed                ; $DE56 A5 0B
 sta z:_var_0016                ; $DE58 85 16
 lda z:_var_000c                ; $DE5A A5 0C
 sta z:_var_0017                ; $DE5C 85 17
 lda z:_var_000d                ; $DE5E A5 0D
 sta z:_var_0018                ; $DE60 85 18
 rts                    ; $DE62 60
 
;.byte $a5, $0a, $85, $15, $a5, $0b, $85, $16, $a5, $0c, $85, $17, $a5, $0d, $85, $18 ; $DE52
;.byte $60                        ; $DE62

_func_de63:
  lda z:_var_0019                ; $DE63  A5 19
  sta z:_var_0006_indexed        ; $DE65  85 06
  lda z:_var_001a                ; $DE67  A5 1A
  sta z:_var_0008                ; $DE69  85 08
  rts                            ; $DE6B  60

_func_de6c:
  lda z:_var_0019                ; $DE6C  A5 19
  sta z:_var_000a_indexed        ; $DE6E  85 0A
  lda z:_var_001a                ; $DE70  A5 1A
  sta z:_var_000c                ; $DE72  85 0C
  rts                            ; $DE74  60

_func_de75:
  lda z:_var_0006_indexed        ; $DE75  A5 06
  sta z:_var_0019                ; $DE77  85 19
  lda z:_var_0008                ; $DE79  A5 08
  sta z:_var_001a                ; $DE7B  85 1A
  rts                            ; $DE7D  60

_func_de7e:
  lda z:_var_000a_indexed        ; $DE7E  A5 0A
  sta z:_var_0019                ; $DE80  85 19
  lda z:_var_000c                ; $DE82  A5 0C
  sta z:_var_001a                ; $DE84  85 1A
  rts                            ; $DE86  60

_data_de87_indexed:
.byte $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00 ; $DE87
.byte $01, $01, $01, $01, $01, $01, $01, $02, $02, $02, $02, $02, $03, $03, $03, $03 ; $DE97
.byte $04, $04, $04, $04, $05, $05, $05, $05, $06, $06, $06, $07, $07, $07, $08, $08 ; $DEA7
.byte $09, $09, $09, $0a, $0a, $0a, $0b, $0b, $0c, $0c, $0d, $0d, $0e, $0e, $0f, $0f ; $DEB7
.byte $10, $10, $11, $11, $12, $12, $13, $13, $14, $14, $15, $15, $16, $17, $17, $18 ; $DEC7
.byte $19, $19, $1a, $1a, $1b, $1c, $1c, $1d, $1e, $1e, $1f, $20, $21, $21, $22, $23 ; $DED7
.byte $24, $24, $25, $26, $27, $27, $28, $29, $2a, $2b, $2b, $2c, $2d, $2e, $2f, $30 ; $DEE7
.byte $31, $31, $32, $33, $34, $35, $36, $37, $38, $39, $3a, $3b, $3c, $3d, $3e, $3f ; $DEF7
.byte $40, $41, $42, $43, $44, $45, $46, $47, $48, $49, $4a, $4b, $4c, $4d, $4e, $4f ; $DF07
.byte $51, $52, $53, $54, $55, $56, $57, $59, $5a, $5b, $5c, $5d, $5f, $60, $61, $62 ; $DF17
.byte $64, $65, $66, $67, $69, $6a, $6b, $6c, $6e, $6f, $70, $72, $73, $74, $76, $77 ; $DF27
.byte $79, $7a, $7b, $7d, $7e, $7f, $81, $82, $84, $85, $87, $88, $8a, $8b, $8d, $8e ; $DF37
.byte $90, $91, $93, $94, $96, $97, $99, $9a, $9c, $9d, $9f, $a0, $a2, $a4, $a5, $a7 ; $DF47
.byte $a9, $aa, $ac, $ad, $af, $b1, $b2, $b4, $b6, $b7, $b9, $bb, $bd, $be, $c0, $c2 ; $DF57
.byte $c4, $c5, $c7, $c9, $cb, $cc, $ce, $d0, $d2, $d4, $d5, $d7, $d9, $db, $dd, $df ; $DF67
.byte $e1, $e2, $e4, $e6, $e8, $ea, $ec, $ee, $f0, $f2, $f4, $f6, $f8, $fa, $fc, $fe ; $DF77

_data_df87_indexed:
.byte $04, $0a, $10, $17, $1d, $23, $2a, $30, $37, $3d, $44, $4b, $52, $59, $60, $67 ; $DF87
.byte $6e, $76, $7d, $85, $8d, $96, $9e, $a7, $b0, $ba, $c3, $cd, $d8, $e3, $ee, $fa ; $DF97
.byte $ff                        ; $DFA7

_data_dfa8_indexed:
.byte $00, $06, $0d, $13, $19, $1f, $26, $2c, $32, $38, $3e, $44, $4a, $50, $56, $5c ; $DFA8
.byte $62, $68, $6d, $73, $79, $7e, $84, $89, $8e, $93, $98, $9d, $a2, $a7, $ac, $b1 ; $DFB8
.byte $b5, $b9, $be, $c2, $c6, $ca, $ce, $d1, $d5, $d8, $dc, $df, $e2, $e5, $e7, $ea ; $DFC8
.byte $ed, $ef, $f1, $f3, $f5, $f7, $f8, $fa, $fb, $fc, $fd, $fe, $ff, $ff, $ff, $ff ; $DFD8

_func_dfe8:
  ldx #$DB                       ; $DFE8  A2 DB

_func_dfea:
  pha                            ; $DFEA  48
  lda z:_var_0006_indexed        ; $DFEB  A5 06
  pha                            ; $DFED  48
  and #$07                       ; $DFEE  29 07
  sta z:_var_00b4                ; $DFF0  85 B4
  pla                            ; $DFF2  68
  lsr a                          ; $DFF3  4A
  lsr a                          ; $DFF4  4A
  lsr a                          ; $DFF5  4A
  sta z:_var_00b2                ; $DFF6  85 B2
  lda z:_var_0008                ; $DFF8  A5 08
  pha                            ; $DFFA  48
  and #$07                       ; $DFFB  29 07
  sta z:_var_00b5                ; $DFFD  85 B5
  pla                            ; $DFFF  68
  lsr a                          ; $E000  4A
  lsr a                          ; $E001  4A
  lsr a                          ; $E002  4A
  sta z:_var_00b3                ; $E003  85 B3
  bit z:$48                      ; $E005  24 48
  tya                            ; $E007  98
  pha                            ; $E008  48
  ldy #$04                       ; $E009  A0 04
  lda z:_var_00b3                ; $E00B  A5 B3
  asl a                          ; $E00D  0A
  asl a                          ; $E00E  0A
  asl a                          ; $E00F  0A
  asl a                          ; $E010  0A
  bcc _label_e015                ; $E011  90 02
  iny                            ; $E013  C8
  iny                            ; $E014  C8

_label_e015:
  asl a                          ; $E015  0A
  bcc _label_e019                ; $E016  90 01
  iny                            ; $E018  C8

_label_e019:
  sty z:_var_0001_indexed,X      ; $E019  94 01
  ora z:_var_00b2                ; $E01B  05 B2
  sta z:_var_0000_indexed,X      ; $E01D  95 00
  pla                            ; $E01F  68
  tay                            ; $E020  A8
  pla                            ; $E021  68
  rts                            ; $E022  60

_func_e023:
  ldx #$78                       ; $E023  A2 78

_func_e025:
  jsr _func_e035                 ; $E025  20 35 E0
  dex                            ; $E028  CA
  bne _func_e025                 ; $E029  D0 FA
  rts                            ; $E02B  60

_func_e02c:
  lda #$00                       ; $E02C  A9 00
  sta z:_var_0002                ; $E02E  85 02

_label_e030:
  lda z:_var_0002                ; $E030  A5 02
  beq _label_e030                ; $E032  F0 FC
  rts                            ; $E034  60

_func_e035:
  lda PPU_STATUS                 ; $E035  AD 02 20
  bmi _func_e035                 ; $E038  30 FB

_label_e03a:
  lda PPU_STATUS                 ; $E03A  AD 02 20
  bpl _label_e03a                ; $E03D  10 FB
  lda #$00                       ; $E03F  A9 00

_label_e041:
  adc #$01                       ; $E041  69 01
  bne _label_e041                ; $E043  D0 FC
  rts                            ; $E045  60

_func_e046:
  ldx #$00                       ; $E046  A2 00
.byte $2c                        ; $E048  2C  branch into instruction detected: bit a:_var_bea6

_func_e049:
.byte $a6, $be                   ; $E049  A6 BE
  lda #$01                       ; $E04B  A9 01
  sta JOYPAD1                    ; $E04D  8D 16 40
  lda #$00                       ; $E050  A9 00
  sta JOYPAD1                    ; $E052  8D 16 40
  sta z:_var_00b6                ; $E055  85 B6
  ldy #$07                       ; $E057  A0 07

_label_e059:
  lda JOYPAD1,X                  ; $E059  BD 16 40
  and #$01                       ; $E05C  29 01
  lsr a                          ; $E05E  4A
  rol z:_var_00b6                ; $E05F  26 B6
  dey                            ; $E061  88
  bpl _label_e059                ; $E062  10 F5
  lda z:_var_0004                ; $E064  A5 04
  bne _label_e06b                ; $E066  D0 03
  lda z:_var_00b6                ; $E068  A5 B6
  rts                            ; $E06A  60

_label_e06b:
  dec z:_var_00b7                ; $E06B  C6 B7
  bne _label_e092                ; $E06D  D0 23
  lda z:_var_tableUpperOrLower                ; $E06F  A5 BF
  cmp #$02                       ; $E071  C9 02
  beq _label_e082                ; $E073  F0 0D
  jsr _func_de30                 ; $E075  20 30 DE
  lda z:_var_0009                ; $E078  A5 09
  cmp #$88                       ; $E07A  C9 88
  bcs _label_e082                ; $E07C  B0 04
  lda #$00                       ; $E07E  A9 00
  beq _label_e087                ; $E080  F0 05

_label_e082:
  jsr _func_e3e2                 ; $E082  20 E2 E3
  and #$83                       ; $E085  29 83

_label_e087:
  sta z:_var_00b8                ; $E087  85 B8
  jsr _func_e3e2                 ; $E089  20 E2 E3
  and #$1F                       ; $E08C  29 1F
  sta z:_var_00b7                ; $E08E  85 B7
  inc z:_var_00b7                ; $E090  E6 B7

_label_e092:
  lda z:_var_00b6                ; $E092  A5 B6
  and #$30                       ; $E094  29 30
  ora z:_var_00b8                ; $E096  05 B8
  sta z:_var_00b6                ; $E098  85 B6
  rts                            ; $E09A  60

_func_e09b:
  ldx #$00                       ; $E09B  A2 00

_label_e09d:
  lda #$24                       ; $E09D  A9 24
  sta a:_var_0400_indexed,X      ; $E09F  9D 00 04
  sta a:_var_0500_indexed,X      ; $E0A2  9D 00 05
  sta a:_var_0600_indexed,X      ; $E0A5  9D 00 06
  sta a:_var_06e0_indexed,X      ; $E0A8  9D E0 06
  dex                            ; $E0AB  CA
  bne _label_e09d                ; $E0AC  D0 EF
  ldx #$20                       ; $E0AE  A2 20
  lda #$00                       ; $E0B0  A9 00
  jsr _func_e0ef                 ; $E0B2  20 EF E0
  lda #$24                       ; $E0B5  A9 24
  ldy #$03                       ; $E0B7  A0 03
  ldx #$C0                       ; $E0B9  A2 C0

_label_e0bb:
  sta PPU_DATA                   ; $E0BB  8D 07 20
  dex                            ; $E0BE  CA
  bne _label_e0bb                ; $E0BF  D0 FA
  dey                            ; $E0C1  88
  bpl _label_e0bb                ; $E0C2  10 F7
  lda z:_var_0000_indexed        ; $E0C4  A5 00
  ora #$04                       ; $E0C6  09 04
  sta PPU_CTRL                   ; $E0C8  8D 00 20
  ldx #$20                       ; $E0CB  A2 20
  lda #$08                       ; $E0CD  A9 08
  ldy #$30                       ; $E0CF  A0 30
  jsr _func_e0e3                 ; $E0D1  20 E3 E0
  ldx #$20                       ; $E0D4  A2 20
  lda #$1D                       ; $E0D6  A9 1D
  ldy #$49                       ; $E0D8  A0 49
  jsr _func_e0e3                 ; $E0DA  20 E3 E0
  lda z:_var_0000_indexed        ; $E0DD  A5 00
  sta PPU_CTRL                   ; $E0DF  8D 00 20
  rts                            ; $E0E2  60

_func_e0e3:
  jsr _func_e0ef                 ; $E0E3  20 EF E0
  ldx #$1E                       ; $E0E6  A2 1E

_label_e0e8:
  sty PPU_DATA                   ; $E0E8  8C 07 20
  dex                            ; $E0EB  CA
  bne _label_e0e8                ; $E0EC  D0 FA
  rts                            ; $E0EE  60

_func_e0ef:
  stx PPU_ADDR                   ; $E0EF  8E 06 20
  sta PPU_ADDR                   ; $E0F2  8D 06 20
  rts                            ; $E0F5  60

_func_e0f6:
  jsr _func_e0ef                 ; $E0F6  20 EF E0
  sty PPU_DATA                   ; $E0F9  8C 07 20
  rts                            ; $E0FC  60

_func_e0fd:
  jsr _func_e2a6                 ; $E0FD  20 A6 E2
  jsr _func_e28a                 ; $E100  20 8A E2
  jsr _func_e403                 ; $E103  20 03 E4
  lda z:_var_tableUpperOrLower                ; $E106  A5 BF
  asl a                          ; $E108  0A
  tax                            ; $E109  AA
  lda a:_data_e2ca_indexed,X     ; $E10A  BD CA E2
  sta z:_var_00dd_indexed        ; $E10D  85 DD
  lda a:_data_e2cb_indexed,X     ; $E10F  BD CB E2
  sta z:_var_00de                ; $E112  85 DE
  lda a:_data_e2d0_indexed,X     ; $E114  BD D0 E2
  sta z:_var_00df_indexed        ; $E117  85 DF
  lda a:_data_e2d1_indexed,X     ; $E119  BD D1 E2
  sta z:_var_00e0                ; $E11C  85 E0
  lda a:_data_e2e2_indexed,X     ; $E11E  BD E2 E2
  sta z:_var_00e1_indexed        ; $E121  85 E1
  lda a:_data_e2e3_indexed,X     ; $E123  BD E3 E2
  sta z:_var_00e2                ; $E126  85 E2
  ldy #$00                       ; $E128  A0 00
  lda #$1E                       ; $E12A  A9 1E
  sta z:_var_00e7                ; $E12C  85 E7
  lda #$08                       ; $E12E  A9 08
  sta z:_var_00db_indexed        ; $E130  85 DB
  lda #$04                       ; $E132  A9 04
  sta z:_var_00dc                ; $E134  85 DC

_label_e136:
  lda #$30                       ; $E136  A9 30
  sta (_var_00db_indexed),Y      ; $E138  91 DB
  inc z:_var_00db_indexed        ; $E13A  E6 DB
  lda #$14                       ; $E13C  A9 14
  sta z:_var_00e6                ; $E13E  85 E6
  lda z:_var_00dc                ; $E140  A5 DC
  clc                            ; $E142  18
  adc #$1C                       ; $E143  69 1C
  tax                            ; $E145  AA
  lda z:_var_00db_indexed        ; $E146  A5 DB
  jsr _func_e0ef                 ; $E148  20 EF E0

_label_e14b:
  lda (_var_00dd_indexed),Y      ; $E14B  B1 DD
  cmp #$15                       ; $E14D  C9 15
  bcs _label_e170                ; $E14F  B0 1F
  sta z:_var_00e3                ; $E151  85 E3
  inc z:_var_00dd_indexed        ; $E153  E6 DD
  bne _label_e159                ; $E155  D0 02
  inc z:_var_00de                ; $E157  E6 DE

_label_e159:
  lda (_var_00dd_indexed),Y      ; $E159  B1 DD

_label_e15b:
  sta PPU_DATA                   ; $E15B  8D 07 20
  sta (_var_00db_indexed),Y      ; $E15E  91 DB
  inc z:_var_00db_indexed        ; $E160  E6 DB
  bne _label_e166                ; $E162  D0 02
  inc z:_var_00dc                ; $E164  E6 DC

_label_e166:
  dec z:_var_00e6                ; $E166  C6 E6
  dec z:_var_00e3                ; $E168  C6 E3
  bne _label_e15b                ; $E16A  D0 EF
  inc z:_var_00e6                ; $E16C  E6 E6
  bne _label_e17b                ; $E16E  D0 0B

_label_e170:
  sta PPU_DATA                   ; $E170  8D 07 20
  sta (_var_00db_indexed),Y      ; $E173  91 DB
  inc z:_var_00db_indexed        ; $E175  E6 DB
  bne _label_e17b                ; $E177  D0 02
  inc z:_var_00dc                ; $E179  E6 DC

_label_e17b:
  inc z:_var_00dd_indexed        ; $E17B  E6 DD
  bne _label_e181                ; $E17D  D0 02
  inc z:_var_00de                ; $E17F  E6 DE

_label_e181:
  dec z:_var_00e6                ; $E181  C6 E6
  bne _label_e14b                ; $E183  D0 C6
  lda #$49                       ; $E185  A9 49
  sta (_var_00db_indexed),Y      ; $E187  91 DB
  lda z:_var_00db_indexed        ; $E189  A5 DB
  clc                            ; $E18B  18
  adc #$0B                       ; $E18C  69 0B
  sta z:_var_00db_indexed        ; $E18E  85 DB
  bcc _label_e194                ; $E190  90 02
  inc z:_var_00dc                ; $E192  E6 DC

_label_e194:
  dec z:_var_00e7                ; $E194  C6 E7
  bne _label_e136                ; $E196  D0 9E
  ldx #$23                       ; $E198  A2 23
  lda #$C0                       ; $E19A  A9 C0
  jsr _func_e0ef                 ; $E19C  20 EF E0

_label_e19f:
  lda (_var_00df_indexed),Y      ; $E19F  B1 DF
  sta PPU_DATA                   ; $E1A1  8D 07 20
  iny                            ; $E1A4  C8
  cpy #$40                       ; $E1A5  C0 40
  bne _label_e19f                ; $E1A7  D0 F6
  ldy #$1F                       ; $E1A9  A0 1F
  jsr _func_e293                 ; $E1AB  20 93 E2
  lda #$FF                       ; $E1AE  A9 FF
  sta z:_var_00c4                ; $E1B0  85 C4
  sta z:_var_00c5                ; $E1B2  85 C5
  lda z:_var_tableUpperOrLower                ; $E1B4  A5 BF
  cmp #$02                       ; $E1B6  C9 02
  bne _label_e1cc                ; $E1B8  D0 12
  ldx #$20                       ; $E1BA  A2 20
  lda #$4D                       ; $E1BC  A9 4D
  jsr _func_e0ef                 ; $E1BE  20 EF E0
  ldx #$0B                       ; $E1C1  A2 0B

_label_e1c3:
  lda a:_data_e2b8_indexed,X     ; $E1C3  BD B8 E2
  sta PPU_DATA                   ; $E1C6  8D 07 20
  dex                            ; $E1C9  CA
  bpl _label_e1c3                ; $E1CA  10 F7

_label_e1cc:
  lda z:_var_tableUpperOrLower                ; $E1CC  A5 BF
  asl a                          ; $E1CE  0A
  tax                            ; $E1CF  AA
  lda a:_data_e2d6_indexed,X     ; $E1D0  BD D6 E2
  sta z:_var_00db_indexed        ; $E1D3  85 DB
  lda a:_data_e2d7_indexed,X     ; $E1D5  BD D7 E2
  sta z:_var_00dc                ; $E1D8  85 DC
  lda a:_data_e2dc_indexed,X     ; $E1DA  BD DC E2
  sta z:_var_00dd_indexed        ; $E1DD  85 DD
  lda a:_data_e2dd_indexed,X     ; $E1DF  BD DD E2
  sta z:_var_00de                ; $E1E2  85 DE
  ldx #$64                       ; $E1E4  A2 64
  ldy #$00                       ; $E1E6  A0 00

_label_e1e8:
  lda (_var_00db_indexed),Y      ; $E1E8  B1 DB
  cmp #$FE                       ; $E1EA  C9 FE
  beq _label_e1f7                ; $E1EC  F0 09
  sta a:_var_0200_indexed,X      ; $E1EE  9D 00 02
  iny                            ; $E1F1  C8
  inx                            ; $E1F2  E8
  cpx #$2C                       ; $E1F3  E0 2C
  bne _label_e1e8                ; $E1F5  D0 F1

_label_e1f7:
  jsr _func_f03f                 ; $E1F7  20 3F F0
  lda z:_var_tableUpperOrLower                ; $E1FA  A5 BF
  cmp #$01                       ; $E1FC  C9 01
  bne _label_e21e                ; $E1FE  D0 1E
  ldx #$04                       ; $E200  A2 04

_label_e202:
  lda a:_var_lowerTableCards                ; $E202  AD 28 01
  and a:_data_d7dd_indexed,X     ; $E205  3D DD D7
  beq _label_e20d                ; $E208  F0 03
  jsr _func_ef79                 ; $E20A  20 79 EF

_label_e20d:
  dex                            ; $E20D  CA
  bpl _label_e202                ; $E20E  10 F2
  lda a:_var_012b                ; $E210  AD 2B 01
  sta a:_var_012c                ; $E213  8D 2C 01
  jsr _func_f1fb                 ; $E216  20 FB F1
  lda a:_var_0133                ; $E219  AD 33 01
  sta z:_var_00f0                ; $E21C  85 F0

_label_e21e:
  lda z:_var_tableUpperOrLower                ; $E21E  A5 BF
  bne _label_e22d                ; $E220  D0 0B
  jsr _func_f0e7                 ; $E222  20 E7 F0
  lda z:_var_00cf                ; $E225  A5 CF
  and #$7F                       ; $E227  29 7F
  tay                            ; $E229  A8
  jsr _func_f0c4                 ; $E22A  20 C4 F0

_label_e22d:
  lda z:_var_tableUpperOrLower                ; $E22D  A5 BF
  cmp #$02                       ; $E22F  C9 02
  bne _label_e236                ; $E231  D0 03
  jsr _func_ea2f                 ; $E233  20 2F EA

_label_e236:
  ldy #$00                       ; $E236  A0 00
  sty a:_var_014b                ; $E238  8C 4B 01

_label_e23b:
  lda (_var_00dd_indexed),Y      ; $E23B  B1 DD
  beq _label_e25d                ; $E23D  F0 1E
  sta z:_var_00e3                ; $E23F  85 E3
  iny                            ; $E241  C8
  lda (_var_00dd_indexed),Y      ; $E242  B1 DD
  sta z:_var_00df_indexed        ; $E244  85 DF
  iny                            ; $E246  C8
  lda (_var_00dd_indexed),Y      ; $E247  B1 DD
  sta z:_var_00e0                ; $E249  85 E0
  iny                            ; $E24B  C8
  sty z:_var_00e4                ; $E24C  84 E4
  lda #$24                       ; $E24E  A9 24
  ldy #$00                       ; $E250  A0 00

_label_e252:
  sta (_var_00df_indexed),Y      ; $E252  91 DF
  iny                            ; $E254  C8
  cpy z:_var_00e3                ; $E255  C4 E3
  bne _label_e252                ; $E257  D0 F9
  ldy z:_var_00e4                ; $E259  A4 E4
  bne _label_e23b                ; $E25B  D0 DE

_label_e25d:
  iny                            ; $E25D  C8
  lda (_var_00dd_indexed),Y      ; $E25E  B1 DD
  cmp #$FF                       ; $E260  C9 FF
  beq _func_e278                 ; $E262  F0 14
  sta z:_var_00e3                ; $E264  85 E3
  iny                            ; $E266  C8
  lda (_var_00dd_indexed),Y      ; $E267  B1 DD
  sta z:_var_00df_indexed        ; $E269  85 DF
  iny                            ; $E26B  C8
  lda (_var_00dd_indexed),Y      ; $E26C  B1 DD
  sta z:_var_00e0                ; $E26E  85 E0
  ldx #$00                       ; $E270  A2 00
  lda z:_var_00e3                ; $E272  A5 E3
  sta (_var_00df_indexed,X)      ; $E274  81 DF
  bne _label_e25d                ; $E276  D0 E5

_func_e278:
  inc a:_var_0153                ; $E278  EE 53 01
  lda z:_var_0000_indexed        ; $E27B  A5 00
  ora #$80                       ; $E27D  09 80
  sta z:_var_0000_indexed        ; $E27F  85 00
  sta PPU_CTRL                   ; $E281  8D 00 20

_label_e284:
  lda a:_var_0153                ; $E284  AD 53 01
  bne _label_e284                ; $E287  D0 FB
  rts                            ; $E289  60

_func_e28a:
  lda #$12                       ; $E28A  A9 12
  sta a:_var_0154                ; $E28C  8D 54 01
  sta a:_var_0155                ; $E28F  8D 55 01
  rts                            ; $E292  60

_func_e293:
  jsr _func_e035                 ; $E293  20 35 E0
  ldx #$3F                       ; $E296  A2 3F
  lda #$00                       ; $E298  A9 00
  jsr _func_e0ef                 ; $E29A  20 EF E0

_label_e29d:
  lda (_var_00e1_indexed),Y      ; $E29D  B1 E1
  sta PPU_DATA                   ; $E29F  8D 07 20
  dey                            ; $E2A2  88
  bpl _label_e29d                ; $E2A3  10 F8
  rts                            ; $E2A5  60

_func_e2a6:
  jsr _func_e035                 ; $E2A6  20 35 E0
  lda #$00                       ; $E2A9  A9 00
  sta PPU_MASK                   ; $E2AB  8D 01 20
  lda z:_var_0000_indexed        ; $E2AE  A5 00
  and #$7F                       ; $E2B0  29 7F
  sta z:_var_0000_indexed        ; $E2B2  85 00
  sta PPU_CTRL                   ; $E2B4  8D 00 20
  rts                            ; $E2B7  60

_data_e2b8_indexed:
.byte $12, $22, $0a, $1d, $1c, $24, $24, $1c, $1e, $17, $18, $0b ; $E2B8

_data_e2c4_indexed:
.byte $0b, $ea                   ; $E2C4

_data_e2c6_indexed:
.byte $06, $04                   ; $E2C6

_data_e2c8_indexed:
.byte $04, $07                   ; $E2C8

_data_e2ca_indexed:
.byte $86                        ; $E2CA

_data_e2cb_indexed:
.byte $c5, $ec, $c7, $3a, $ca    ; $E2CB

_data_e2d0_indexed:
.byte $e4                        ; $E2D0

_data_e2d1_indexed:
.byte $c6, $65, $c9, $3e, $cb    ; $E2D1

_data_e2d6_indexed:
.byte $24                        ; $E2D6

_data_e2d7_indexed:
.byte $c7, $a5, $c9, $7e, $cb    ; $E2D7

_data_e2dc_indexed:
.byte $e8                        ; $E2DC

_data_e2dd_indexed:
.byte $e2, $2f, $e3, $6a, $e3    ; $E2DD

_data_e2e2_indexed:
.byte $a2                        ; $E2E2

_data_e2e3_indexed:
.byte $e3, $a2, $e3, $c2, $e3, $02, $91, $04, $06, $af, $04, $06, $cf, $04, $02, $37 ; $E2E3
.byte $05, $06, $cf, $06, $00, $20, $8c, $04, $21, $98, $04, $22, $19, $06, $23, $4e ; $E2F3
.byte $05, $2b, $97, $05, $2b, $b7, $05, $2b, $d7, $05, $2a, $6c, $05, $2a, $0a, $06 ; $E303
.byte $2a, $2a, $06, $2a, $4a, $06, $2a, $6a, $06, $2c, $ce, $04, $2d, $d5, $04, $e6 ; $E313
.byte $2d, $07, $e7, $36, $07, $88, $ee, $00, $01, $49, $01, $ff, $0a, $6d, $04, $0a ; $E323
.byte $8d, $04, $0a, $ad, $04, $03, $17, $05, $00, $31, $3a, $07, $2a, $7a, $05, $2a ; $E333
.byte $9a, $05, $2a, $ba, $05, $2a, $e9, $04, $2a, $09, $05, $2a, $29, $05, $2a, $49 ; $E343
.byte $05, $2a, $69, $05, $2a, $89, $05, $2a, $a9, $05, $72, $2a, $06, $73, $39, $06 ; $E353
.byte $e6, $0d, $07, $e7, $16, $07, $ff, $06, $50, $05, $06, $70, $05, $06, $90, $05 ; $E363
.byte $06, $b0, $05, $06, $d0, $05, $06, $f0, $05, $06, $10, $06, $06, $30, $06, $14 ; $E373
.byte $a9, $06, $00, $db, $f0, $04, $db, $f1, $04, $db, $f2, $04, $db, $f3, $04, $db ; $E383
.byte $f4, $04, $db, $f5, $04, $03, $8e, $02, $43, $9a, $02, $00, $ae, $02, $ff, $25 ; $E393
.byte $12, $30, $0f, $27, $07, $21, $0f, $37, $30, $25, $0f, $21, $10, $30, $0f ; $E3A3

_data_e3b2_indexed:
.byte $30, $25, $2a, $0f, $30, $27, $12, $0f, $30, $10, $12, $0f, $30, $21, $12, $0f ; $E3B2
.byte $27, $16, $30, $0f, $36, $07, $25, $0f, $12, $16, $27, $0f, $21, $10, $30, $0f ; $E3C2
.byte $30, $30, $30, $0f, $30, $25, $26, $0f, $30, $21, $12, $0f, $30, $27, $2a, $0f ; $E3D2

_func_e3e2:
  txa                            ; $E3E2  8A
  pha                            ; $E3E3  48
  ldx #$0B                       ; $E3E4  A2 0B

_label_e3e6:
  asl z:_var_00ba                ; $E3E6  06 BA
  rol z:_var_00bb                ; $E3E8  26 BB
  rol a                          ; $E3EA  2A
  rol a                          ; $E3EB  2A
  eor z:_var_00ba                ; $E3EC  45 BA
  rol a                          ; $E3EE  2A
  eor z:_var_00ba                ; $E3EF  45 BA
  lsr a                          ; $E3F1  4A
  lsr a                          ; $E3F2  4A
  eor #$FF                       ; $E3F3  49 FF
  and #$01                       ; $E3F5  29 01
  ora z:_var_00ba                ; $E3F7  05 BA
  sta z:_var_00ba                ; $E3F9  85 BA
  dex                            ; $E3FB  CA
  bne _label_e3e6                ; $E3FC  D0 E8
  pla                            ; $E3FE  68
  tax                            ; $E3FF  AA
  lda z:_var_00ba                ; $E400  A5 BA
  rts                            ; $E402  60

_func_e403:
  ldx #$00                       ; $E403  A2 00
  lda #$F0                       ; $E405  A9 F0

_label_e407:
  sta a:_var_0200_indexed,X      ; $E407  9D 00 02
  dex                            ; $E40A  CA
  bne _label_e407                ; $E40B  D0 FA
  rts                            ; $E40D  60

_func_e40e:
  ldx z:_var_001b                ; $E40E  A6 1B
  lda a:_data_e482_indexed,X     ; $E410  BD 82 E4
  beq _label_e45b                ; $E413  F0 46
  ldy a:_data_e487_indexed,X     ; $E415  BC 87 E4
  sty a:_var_022d                ; $E418  8C 2D 02
  iny                            ; $E41B  C8
  sty a:$0231                    ; $E41C  8C 31 02
  sty a:$0239                    ; $E41F  8C 39 02
  iny                            ; $E422  C8
  sty a:$0235                    ; $E423  8C 35 02
  lda z:_var_0016                ; $E426  A5 16
  tay                            ; $E428  A8
  sec                            ; $E429  38
  sbc #$07                       ; $E42A  E9 07
  sta a:_var_022f                ; $E42C  8D 2F 02
  sta a:$0237                    ; $E42F  8D 37 02
  iny                            ; $E432  C8
  sty a:$0233                    ; $E433  8C 33 02
  sty a:$023B                    ; $E436  8C 3B 02
  lda z:_var_0018                ; $E439  A5 18
  sta a:_var_0234                ; $E43B  8D 34 02
  sta a:_var_0238                ; $E43E  8D 38 02
  sec                            ; $E441  38
  sbc #$08                       ; $E442  E9 08
  sta a:_var_022c_indexed        ; $E444  8D 2C 02
  sta a:_var_0230                ; $E447  8D 30 02
  lda #$00                       ; $E44A  A9 00
  sta a:_var_022e                ; $E44C  8D 2E 02
  sta a:$0232                    ; $E44F  8D 32 02
  sta a:$0236                    ; $E452  8D 36 02
  lda #$80                       ; $E455  A9 80
  sta a:$023A                    ; $E457  8D 3A 02
  rts                            ; $E45A  60

_label_e45b:
  lda a:_data_e487_indexed,X     ; $E45B  BD 87 E4
  sta a:_var_022d                ; $E45E  8D 2D 02
  lda z:_var_0016                ; $E461  A5 16
  sec                            ; $E463  38
  sbc #$03                       ; $E464  E9 03
  sta a:_var_022f                ; $E466  8D 2F 02
  lda z:_var_0018                ; $E469  A5 18
  sec                            ; $E46B  38
  sbc #$04                       ; $E46C  E9 04
  sta a:_var_022c_indexed        ; $E46E  8D 2C 02
  lda #$00                       ; $E471  A9 00
  sta a:_var_022e                ; $E473  8D 2E 02
  lda #$F0                       ; $E476  A9 F0
  sta a:_var_0230                ; $E478  8D 30 02
  sta a:_var_0234                ; $E47B  8D 34 02
  sta a:_var_0238                ; $E47E  8D 38 02
  rts                            ; $E481  60

_data_e482_indexed:
.byte $03, $03, $00, $00, $00    ; $E482

_data_e487_indexed:
.byte $90, $93, $96, $97, $98    ; $E487

_func_e48c:
  ldx #$0C                       ; $E48C  A2 0C
  lda #$F0                       ; $E48E  A9 F0

_label_e490:
  sta a:_var_022c_indexed,X      ; $E490  9D 2C 02
  dex                            ; $E493  CA
  bpl _label_e490                ; $E494  10 FA
  rts                            ; $E496  60

_func_e497:
  lda z:_var_00c0_indexed        ; $E497  A5 C0
  lsr a                          ; $E499  4A
  lsr a                          ; $E49A  4A
  lsr a                          ; $E49B  4A
  cmp z:_var_00c4                ; $E49C  C5 C4
  beq _label_e506                ; $E49E  F0 66
  sta z:_var_00c4                ; $E4A0  85 C4
  tax                            ; $E4A2  AA
  inc z:_var_00c6                ; $E4A3  E6 C6
  ldy z:_var_tableUpperOrLower                ; $E4A5  A4 BF
  lda #$70                       ; $E4A7  A9 70
  sta a:$023F                    ; $E4A9  8D 3F 02
  lda #$78                       ; $E4AC  A9 78
  sta a:$0243                    ; $E4AE  8D 43 02
  lda a:_data_e590_indexed,X     ; $E4B1  BD 90 E5
  sta a:$0247                    ; $E4B4  8D 47 02
  lda a:_data_e593_indexed,X     ; $E4B7  BD 93 E5
  sta a:$024B                    ; $E4BA  8D 4B 02
  lda a:_data_e596_indexed,X     ; $E4BD  BD 96 E5
  sta a:$024F                    ; $E4C0  8D 4F 02
  lda a:_data_e5a2_indexed,Y     ; $E4C3  B9 A2 E5
  sta z:_var_00e3                ; $E4C6  85 E3
  clc                            ; $E4C8  18
  lda a:_data_e5a4_indexed,X     ; $E4C9  BD A4 E5
  adc z:_var_00e3                ; $E4CC  65 E3
  sta a:$023C                    ; $E4CE  8D 3C 02
  lda a:_data_e5a7_indexed,X     ; $E4D1  BD A7 E5
  adc z:_var_00e3                ; $E4D4  65 E3
  sta a:$0240                    ; $E4D6  8D 40 02
  lda a:_data_e5aa_indexed,X     ; $E4D9  BD AA E5
  adc z:_var_00e3                ; $E4DC  65 E3
  sta a:$0244                    ; $E4DE  8D 44 02
  lda a:_data_e5ad_indexed,X     ; $E4E1  BD AD E5
  adc z:_var_00e3                ; $E4E4  65 E3
  sta a:$0248                    ; $E4E6  8D 48 02
  lda a:_data_e5b0_indexed,X     ; $E4E9  BD B0 E5
  adc z:_var_00e3                ; $E4EC  65 E3
  sta a:$024C                    ; $E4EE  8D 4C 02
  ldy a:_data_e5b3_indexed,X     ; $E4F1  BC B3 E5
  ldx #$10                       ; $E4F4  A2 10

_label_e4f6:
  tya                            ; $E4F6  98
  sta a:_var_023d_indexed,X      ; $E4F7  9D 3D 02
  dey                            ; $E4FA  88
  lda #$00                       ; $E4FB  A9 00
  sta a:_var_023e_indexed,X      ; $E4FD  9D 3E 02
  dex                            ; $E500  CA
  dex                            ; $E501  CA
  dex                            ; $E502  CA
  dex                            ; $E503  CA
  bpl _label_e4f6                ; $E504  10 F0

_label_e506:
  lda z:_var_00c1                ; $E506  A5 C1
  lsr a                          ; $E508  4A
  lsr a                          ; $E509  4A
  lsr a                          ; $E50A  4A
  cmp z:_var_00c5                ; $E50B  C5 C5
  beq _label_e575                ; $E50D  F0 66
  sta z:_var_00c5                ; $E50F  85 C5
  tax                            ; $E511  AA
  inc z:_var_00c6                ; $E512  E6 C6
  ldy z:_var_tableUpperOrLower                ; $E514  A4 BF
  lda #$A8                       ; $E516  A9 A8
  sta a:$0253                    ; $E518  8D 53 02
  lda #$A0                       ; $E51B  A9 A0
  sta a:$0257                    ; $E51D  8D 57 02
  lda a:_data_e599_indexed,X     ; $E520  BD 99 E5
  sta a:$025B                    ; $E523  8D 5B 02
  lda a:_data_e59c_indexed,X     ; $E526  BD 9C E5
  sta a:$025F                    ; $E529  8D 5F 02
  lda a:_data_e59f_indexed,X     ; $E52C  BD 9F E5
  sta a:$0263                    ; $E52F  8D 63 02
  lda a:_data_e5a2_indexed,Y     ; $E532  B9 A2 E5
  sta z:_var_00e3                ; $E535  85 E3
  clc                            ; $E537  18
  lda a:_data_e5a4_indexed,X     ; $E538  BD A4 E5
  adc z:_var_00e3                ; $E53B  65 E3
  sta a:$0250                    ; $E53D  8D 50 02
  lda a:_data_e5a7_indexed,X     ; $E540  BD A7 E5
  adc z:_var_00e3                ; $E543  65 E3
  sta a:$0254                    ; $E545  8D 54 02
  lda a:_data_e5aa_indexed,X     ; $E548  BD AA E5
  adc z:_var_00e3                ; $E54B  65 E3
  sta a:$0258                    ; $E54D  8D 58 02
  lda a:_data_e5ad_indexed,X     ; $E550  BD AD E5
  adc z:_var_00e3                ; $E553  65 E3
  sta a:$025C                    ; $E555  8D 5C 02
  lda a:_data_e5b0_indexed,X     ; $E558  BD B0 E5
  adc z:_var_00e3                ; $E55B  65 E3
  sta a:$0260                    ; $E55D  8D 60 02
  ldy a:_data_e5b3_indexed,X     ; $E560  BC B3 E5
  ldx #$10                       ; $E563  A2 10

_label_e565:
  tya                            ; $E565  98
  sta a:_var_0251_indexed,X      ; $E566  9D 51 02
  dey                            ; $E569  88
  lda #$40                       ; $E56A  A9 40
  sta a:_var_0252_indexed,X      ; $E56C  9D 52 02
  dex                            ; $E56F  CA
  dex                            ; $E570  CA
  dex                            ; $E571  CA
  dex                            ; $E572  CA
  bpl _label_e565                ; $E573  10 F0

_label_e575:
  rts                            ; $E575  60

_data_e576_indexed:
.byte $23, $22                   ; $E576

_data_e578_indexed:
.byte $0d, $ed                   ; $E578

_data_e57a_indexed:
.byte $23, $22                   ; $E57A

_data_e57c_indexed:
.byte $16, $f6                   ; $E57C

_data_e57e_indexed:
.byte $24, $24, $f6              ; $E57E

_data_e581_indexed:
.byte $e6, $d6, $f7              ; $E581

_data_e584_indexed:
.byte $e7, $d7, $f8              ; $E584

_data_e587_indexed:
.byte $24, $24, $f9              ; $E587

_data_e58a_indexed:
.byte $fe, $fc, $fa              ; $E58A

_data_e58d_indexed:
.byte $ff, $fd, $fb              ; $E58D

_data_e590_indexed:
.byte $70, $80, $80              ; $E590

_data_e593_indexed:
.byte $78, $70, $70              ; $E593

_data_e596_indexed:
.byte $80, $ff, $78              ; $E596

_data_e599_indexed:
.byte $a8, $98, $98              ; $E599

_data_e59c_indexed:
.byte $a0, $a8, $a8              ; $E59C

_data_e59f_indexed:
.byte $98, $ff, $a0              ; $E59F

_data_e5a2_indexed:
.byte $08, $00                   ; $E5A2

_data_e5a4_indexed:
.byte $bf, $bf, $b7              ; $E5A4

_data_e5a7_indexed:
.byte $c3, $bf, $b7              ; $E5A7

_data_e5aa_indexed:
.byte $c7, $bf, $b5              ; $E5AA

_data_e5ad_indexed:
.byte $cb, $c7, $bf              ; $E5AD

_data_e5b0_indexed:
.byte $cb, $f0, $bf              ; $E5B0

_data_e5b3_indexed:
.byte $c4, $c9, $cd              ; $E5B3

_func_e5b6:
  lda z:_var_00c6                ; $E5B6  A5 C6
  beq _label_e608                ; $E5B8  F0 4E
  lda #$00                       ; $E5BA  A9 00
  sta z:_var_00c6                ; $E5BC  85 C6
  lda z:_var_0000_indexed        ; $E5BE  A5 00
  ora #$04                       ; $E5C0  09 04
  sta PPU_CTRL                   ; $E5C2  8D 00 20
  ldy z:_var_tableUpperOrLower                ; $E5C5  A4 BF
  ldx a:_data_e576_indexed,Y     ; $E5C7  BE 76 E5
  lda a:_data_e578_indexed,Y     ; $E5CA  B9 78 E5
  jsr _func_e0ef                 ; $E5CD  20 EF E0
  ldx z:_var_00c4                ; $E5D0  A6 C4
  lda a:_data_e57e_indexed,X     ; $E5D2  BD 7E E5
  sta PPU_DATA                   ; $E5D5  8D 07 20
  lda a:_data_e581_indexed,X     ; $E5D8  BD 81 E5
  sta PPU_DATA                   ; $E5DB  8D 07 20
  lda a:_data_e584_indexed,X     ; $E5DE  BD 84 E5
  sta PPU_DATA                   ; $E5E1  8D 07 20
  ldy z:_var_tableUpperOrLower                ; $E5E4  A4 BF
  ldx a:_data_e57a_indexed,Y     ; $E5E6  BE 7A E5
  lda a:_data_e57c_indexed,Y     ; $E5E9  B9 7C E5
  jsr _func_e0ef                 ; $E5EC  20 EF E0
  ldx z:_var_00c5                ; $E5EF  A6 C5
  lda a:_data_e587_indexed,X     ; $E5F1  BD 87 E5
  sta PPU_DATA                   ; $E5F4  8D 07 20
  lda a:_data_e58a_indexed,X     ; $E5F7  BD 8A E5
  sta PPU_DATA                   ; $E5FA  8D 07 20
  lda a:_data_e58d_indexed,X     ; $E5FD  BD 8D E5
  sta PPU_DATA                   ; $E600  8D 07 20
  lda z:_var_0000_indexed        ; $E603  A5 00
  sta PPU_CTRL                   ; $E605  8D 00 20

_label_e608:
  rts                            ; $E608  60

_func_e609:
  lda z:_var_00c0_indexed        ; $E609  A5 C0
  beq _label_e615                ; $E60B  F0 08
  cmp #$17                       ; $E60D  C9 17
  beq _label_e615                ; $E60F  F0 04
  cmp #$0F                       ; $E611  C9 0F
  bne _label_e645                ; $E613  D0 30

_label_e615:
  lda #$00                       ; $E615  A9 00
  sta z:_var_00c2_indexed        ; $E617  85 C2
  lda z:_var_00b6                ; $E619  A5 B6
  and #$0F                       ; $E61B  29 0F
  beq _label_e639                ; $E61D  F0 1A
  inc z:_var_00c2_indexed        ; $E61F  E6 C2
  inc z:_var_00c0_indexed        ; $E621  E6 C0
  lda z:_var_00c0_indexed        ; $E623  A5 C0
  cmp #$01                       ; $E625  C9 01
  bne _label_e62f                ; $E627  D0 06
  lda #$20                       ; $E629  A9 20
  sta z:_var_00ff                ; $E62B  85 FF
  bne _label_e64c                ; $E62D  D0 1D

_label_e62f:
  cmp #$18                       ; $E62F  C9 18
  bcc _label_e64c                ; $E631  90 19
  dec z:_var_00c0_indexed        ; $E633  C6 C0
  dec z:_var_00c2_indexed        ; $E635  C6 C2
  beq _label_e64c                ; $E637  F0 13

_label_e639:
  dec z:_var_00c2_indexed        ; $E639  C6 C2
  dec z:_var_00c0_indexed        ; $E63B  C6 C0
  bpl _label_e64c                ; $E63D  10 0D
  inc z:_var_00c0_indexed        ; $E63F  E6 C0
  inc z:_var_00c2_indexed        ; $E641  E6 C2
  beq _label_e64c                ; $E643  F0 07

_label_e645:
  clc                            ; $E645  18
  lda z:_var_00c0_indexed        ; $E646  A5 C0
  adc z:_var_00c2_indexed        ; $E648  65 C2
  sta z:_var_00c0_indexed        ; $E64A  85 C0

_label_e64c:
  lda z:_var_00c1                ; $E64C  A5 C1
  beq _label_e658                ; $E64E  F0 08
  cmp #$17                       ; $E650  C9 17
  beq _label_e658                ; $E652  F0 04
  cmp #$0F                       ; $E654  C9 0F
  bne _label_e687                ; $E656  D0 2F

_label_e658:
  lda #$00                       ; $E658  A9 00
  sta z:_var_00c3                ; $E65A  85 C3
  lda z:_var_00b6                ; $E65C  A5 B6
  and #$C0                       ; $E65E  29 C0
  beq _label_e67c                ; $E660  F0 1A
  inc z:_var_00c3                ; $E662  E6 C3
  inc z:_var_00c1                ; $E664  E6 C1
  lda z:_var_00c1                ; $E666  A5 C1
  cmp #$01                       ; $E668  C9 01
  bne _label_e672                ; $E66A  D0 06
  lda #$20                       ; $E66C  A9 20
  sta z:_var_00ff                ; $E66E  85 FF
  bne _label_e686                ; $E670  D0 14

_label_e672:
  cmp #$18                       ; $E672  C9 18
  bcc _label_e686                ; $E674  90 10
  dec z:_var_00c1                ; $E676  C6 C1
  dec z:_var_00c3                ; $E678  C6 C3
  beq _label_e686                ; $E67A  F0 0A

_label_e67c:
  dec z:_var_00c3                ; $E67C  C6 C3
  dec z:_var_00c1                ; $E67E  C6 C1
  bpl _label_e686                ; $E680  10 04
  inc z:_var_00c1                ; $E682  E6 C1
  inc z:_var_00c3                ; $E684  E6 C3

_label_e686:
  rts                            ; $E686  60

_label_e687:
  clc                            ; $E687  18
  lda z:_var_00c1                ; $E688  A5 C1
  adc z:_var_00c3                ; $E68A  65 C3
  sta z:_var_00c1                ; $E68C  85 C1
  rts                            ; $E68E  60

_func_e68f:
  lda a:_var_0134                ; $E68F  AD 34 01
  beq _label_e6a1                ; $E692  F0 0D
  lda z:_var_0005                ; $E694  A5 05
  and #$3F                       ; $E696  29 3F
  bne _label_e6a1                ; $E698  D0 07
  dec a:_var_0134                ; $E69A  CE 34 01
  bne _label_e6a1                ; $E69D  D0 02
  dec z:_var_00f0                ; $E69F  C6 F0

_label_e6a1:
  lda z:_var_00d1                ; $E6A1  A5 D1
  beq _label_e70b                ; $E6A3  F0 66
  bpl _label_e6b4                ; $E6A5  10 0D
  lda #$07                       ; $E6A7  A9 07
  sta a:_var_0127_indexed        ; $E6A9  8D 27 01
  lda #$08                       ; $E6AC  A9 08
  sta z:_var_00ff                ; $E6AE  85 FF
  dec z:_var_00f0                ; $E6B0  C6 F0
  bne _label_e70b                ; $E6B2  D0 57

_label_e6b4:
  ldx #$04                       ; $E6B4  A2 04
  stx z:_var_00fe                ; $E6B6  86 FE
  ldx #$00                       ; $E6B8  A2 00
  lda z:_var_00ee                ; $E6BA  A5 EE
  cmp #$82                       ; $E6BC  C9 82
  bcc _label_e6c6                ; $E6BE  90 06
  inx                            ; $E6C0  E8
  cmp #$92                       ; $E6C1  C9 92
  bcc _label_e6c6                ; $E6C3  90 01
  inx                            ; $E6C5  E8

; upper table tile hit - type check?
; $E7A6 = tile types?
; $0127 = tile tracking?
; $0118-$0120 = tiles
; offset 0x37 for Penguins
_label_e6c6:
  lda a:_data_e7a6_indexed,X     ; $E6C6  BD A6 E7
  tay                            ; $E6C9  A8
  ora a:_var_0127_indexed        ; $E6CA  0D 27 01
  cmp #$FF                       ; $E6CD  C9 FF
  bne _label_e70b                ; $E6CF  D0 3A
  tya                            ; $E6D1  98
  ldy a:_var_upperTableTileSpinners,X      ; $E6D2  BC 18 01
  bne _label_e6de                ; $E6D5  D0 07
  pha                            ; $E6D7  48
  lda #$37                       ; $E6D8  A9 37
  jsr _func_ee3d                 ; $E6DA  20 3D EE
  pla                            ; $E6DD  68

; upper table penguin/333/777 tiles complete check
_label_e6de:
  and a:_var_0127_indexed        ; $E6DE  2D 27 01
  sta a:_var_0127_indexed        ; $E6E1  8D 27 01
  bne _label_e70b                ; $E6E4  D0 25
  ldx a:_var_upperTableTileSpinners        ; $E6E6  AE 18 01
  cpx a:$0119                    ; $E6E9  EC 19 01
  bne _label_e70b                ; $E6EC  D0 1D
  cpx a:$011A                    ; $E6EE  EC 1A 01
  bne _label_e70b                ; $E6F1  D0 18
  txa                            ; $E6F3  8A
  bne _label_e6f9                ; $E6F4  D0 03
  inc a:_var_014b                ; $E6F6  EE 4B 01

; score upper table pengin/333/777 tile offsets ($E787)
_label_e6f9:
  lda a:_data_e78a_indexed,X     ; $E6F9  BD 8A E7
  sta a:_var_0134                ; $E6FC  8D 34 01
  lda a:_data_e787_indexed,X     ; $E6FF  BD 87 E7
  jsr _func_ee3d                 ; $E702  20 3D EE
  lda #$01                       ; $E705  A9 01
  sta z:_var_00fd                ; $E707  85 FD
  inc z:_var_00f0                ; $E709  E6 F0

_label_e70b:
  lda #$00                       ; $E70B  A9 00
  sta z:_var_00d1                ; $E70D  85 D1
  lda z:_var_0005                ; $E70F  A5 05
  and #$03                       ; $E711  29 03
  beq _label_e716                ; $E713  F0 01
  rts                            ; $E715  60

_label_e716:
  ldx #$02                       ; $E716  A2 02

_label_e718:
  lda a:_var_0127_indexed        ; $E718  AD 27 01
  and a:_data_e7a9_indexed,X     ; $E71B  3D A9 E7
  beq _label_e72c                ; $E71E  F0 0C
  ldy a:_var_upperTableTileSpinners,X      ; $E720  BC 18 01
  dey                            ; $E723  88
  bpl _label_e728                ; $E724  10 02
  ldy #$02                       ; $E726  A0 02

_label_e728:
  tya                            ; $E728  98
  sta a:_var_upperTableTileSpinners,X      ; $E729  9D 18 01

_label_e72c:
  dex                            ; $E72C  CA
  bpl _label_e718                ; $E72D  10 E9
  lda #$02                       ; $E72F  A9 02
  sta z:_var_00e7                ; $E731  85 E7

_label_e733:
  ldx z:_var_00e7                ; $E733  A6 E7
  lda a:_var_upperTableTileSpinners,X      ; $E735  BD 18 01
  ldy a:_data_e78d_indexed,X     ; $E738  BC 8D E7
  and #$03                       ; $E73B  29 03
  beq _label_e75f                ; $E73D  F0 20
  asl a                          ; $E73F  0A
  asl a                          ; $E740  0A
  asl a                          ; $E741  0A
  tax                            ; $E742  AA
  lda #$04                       ; $E743  A9 04
  sta z:_var_00e6                ; $E745  85 E6

_label_e747:
  lda a:_data_e788_indexed,X     ; $E747  BD 88 E7
  sta a:_var_0285_indexed,Y      ; $E74A  99 85 02
  inx                            ; $E74D  E8
  iny                            ; $E74E  C8
  lda a:_data_e788_indexed,X     ; $E74F  BD 88 E7
  sta a:_var_0285_indexed,Y      ; $E752  99 85 02
  inx                            ; $E755  E8
  iny                            ; $E756  C8
  iny                            ; $E757  C8
  iny                            ; $E758  C8
  dec z:_var_00e6                ; $E759  C6 E6
  bne _label_e747                ; $E75B  D0 EA  unconditional branch pattern (complementary branches)
  beq _label_e782                ; $E75D  F0 23

_label_e75f:
  lda z:_var_0005                ; $E75F  A5 05
  and #$20                       ; $E761  29 20
  beq _label_e768                ; $E763  F0 03
  inx                            ; $E765  E8
  inx                            ; $E766  E8
  inx                            ; $E767  E8

_label_e768:
  lda a:_data_e7a0_indexed,X     ; $E768  BD A0 E7
  tax                            ; $E76B  AA
  lda #$04                       ; $E76C  A9 04
  sta z:_var_00e6                ; $E76E  85 E6

_label_e770:
  txa                            ; $E770  8A
  sta a:_var_0285_indexed,Y      ; $E771  99 85 02
  iny                            ; $E774  C8
  lda #$03                       ; $E775  A9 03
  sta a:_var_0285_indexed,Y      ; $E777  99 85 02
  iny                            ; $E77A  C8
  inx                            ; $E77B  E8
  iny                            ; $E77C  C8
  iny                            ; $E77D  C8
  dec z:_var_00e6                ; $E77E  C6 E6
  bne _label_e770                ; $E780  D0 EE

_label_e782:
  dec z:_var_00e7                ; $E782  C6 E7
  bpl _label_e733                ; $E784  10 AD
  rts                            ; $E786  60

; score upper table penguin/333/777 tiles offset (333=0x3c,777=0x05)
_data_e787_indexed:
.byte $46                        ; $E787

_data_e788_indexed:
.byte $3c, $05                   ; $E788

_data_e78a_indexed:
.byte $00, $06, $0e              ; $E78A

_data_e78d_indexed:
.byte $00, $10, $20, $81, $00, $82, $00, $84, $00, $83, $00, $80, $00, $80, $40, $79 ; $E78D
.byte $00, $85, $00              ; $E79D

_data_e7a0_indexed:
.byte $d0, $d4, $d8, $50, $dc, $9c ; $E7A0

; upper table tiles types?
_data_e7a6_indexed:
.byte $fe, $fd, $fb              ; $E7A6

_data_e7a9_indexed:
.byte $01, $02, $04              ; $E7A9

_func_e7ac:
  ldx #$1C                       ; $E7AC  A2 1C
  ldy #$07                       ; $E7AE  A0 07

_label_e7b0:
  lda a:_data_ea60_indexed,Y     ; $E7B0  B9 60 EA
  sta a:_var_028c_indexed,X      ; $E7B3  9D 8C 02
  dex                            ; $E7B6  CA
  dex                            ; $E7B7  CA
  dex                            ; $E7B8  CA
  dex                            ; $E7B9  CA
  dey                            ; $E7BA  88
  bpl _label_e7b0                ; $E7BB  10 F3
  lda z:_var_00ec                ; $E7BD  A5 EC
  clc                            ; $E7BF  18
  adc #$70                       ; $E7C0  69 70
  sta a:$028F                    ; $E7C2  8D 8F 02
  adc #$08                       ; $E7C5  69 08
  sta a:$0293                    ; $E7C7  8D 93 02
  sta a:$029F                    ; $E7CA  8D 9F 02
  sta a:$02A7                    ; $E7CD  8D A7 02
  adc #$08                       ; $E7D0  69 08
  sta a:$0297                    ; $E7D2  8D 97 02
  sta a:$02A3                    ; $E7D5  8D A3 02
  sta a:$02AB                    ; $E7D8  8D AB 02
  adc #$08                       ; $E7DB  69 08
  sta a:$029B                    ; $E7DD  8D 9B 02
  lda z:_var_00b6                ; $E7E0  A5 B6
  and #$01                       ; $E7E2  29 01
  beq _label_e801                ; $E7E4  F0 1B
  lda #$03                       ; $E7E6  A9 03
  sta a:_var_011b                ; $E7E8  8D 1B 01
  jsr _func_ea50                 ; $E7EB  20 50 EA
  inc z:_var_00ec                ; $E7EE  E6 EC
  lda z:_var_00ec                ; $E7F0  A5 EC
  cmp #$31                       ; $E7F2  C9 31
  bcs _label_e7fc                ; $E7F4  B0 06
  lda #$10                       ; $E7F6  A9 10
  sta z:_var_00fe                ; $E7F8  85 FE
  bne _label_e801                ; $E7FA  D0 05

_label_e7fc:
  dec z:_var_00ec                ; $E7FC  C6 EC
  jsr _func_ea58                 ; $E7FE  20 58 EA

_label_e801:
  lda z:_var_00b6                ; $E801  A5 B6
  and #$02                       ; $E803  29 02
  beq _label_e81e                ; $E805  F0 17
  lda #$00                       ; $E807  A9 00
  sta a:_var_011b                ; $E809  8D 1B 01
  jsr _func_ea58                 ; $E80C  20 58 EA
  dec z:_var_00ec                ; $E80F  C6 EC
  bmi _label_e819                ; $E811  30 06
  lda #$10                       ; $E813  A9 10
  sta z:_var_00fe                ; $E815  85 FE
  bne _label_e81e                ; $E817  D0 05

_label_e819:
  inc z:_var_00ec                ; $E819  E6 EC
  jsr _func_ea50                 ; $E81B  20 50 EA

_label_e81e:
  lda z:_var_00ec                ; $E81E  A5 EC
  lsr a                          ; $E820  4A
  and #$03                       ; $E821  29 03
  cmp #$03                       ; $E823  C9 03
  bne _label_e829                ; $E825  D0 02
  lda #$01                       ; $E827  A9 01

_label_e829:
  clc                            ; $E829  18
  adc a:_var_011b                ; $E82A  6D 1B 01
  tax                            ; $E82D  AA
  lda a:_data_ea68_indexed,X     ; $E82E  BD 68 EA
  sta a:$0291                    ; $E831  8D 91 02
  lda a:_data_ea6e_indexed,X     ; $E834  BD 6E EA
  sta a:$0295                    ; $E837  8D 95 02
  lda a:_data_ea74_indexed,X     ; $E83A  BD 74 EA
  sta a:$029D                    ; $E83D  8D 9D 02
  lda a:_data_ea7a_indexed,X     ; $E840  BD 7A EA
  sta a:$02A1                    ; $E843  8D A1 02
  lda a:_data_ea80_indexed,X     ; $E846  BD 80 EA
  sta a:$02A5                    ; $E849  8D A5 02
  lda a:_data_ea86_indexed,X     ; $E84C  BD 86 EA
  sta a:$02A9                    ; $E84F  8D A9 02
  lda #$25                       ; $E852  A9 25
  sta a:$028D                    ; $E854  8D 8D 02
  sta a:$0299                    ; $E857  8D 99 02
  lda #$03                       ; $E85A  A9 03
  ldy a:_var_011b                ; $E85C  AC 1B 01
  beq _label_e863                ; $E85F  F0 02
  lda #$43                       ; $E861  A9 43

_label_e863:
  sta a:$0292                    ; $E863  8D 92 02
  sta a:$0296                    ; $E866  8D 96 02
  and #$FD                       ; $E869  29 FD
  ldx #$0C                       ; $E86B  A2 0C

_label_e86d:
  sta a:_var_029e_indexed,X      ; $E86D  9D 9E 02
  dex                            ; $E870  CA
  dex                            ; $E871  CA
  dex                            ; $E872  CA
  dex                            ; $E873  CA
  bpl _label_e86d                ; $E874  10 F7
  ldx #$09                       ; $E876  A2 09
  lda #$24                       ; $E878  A9 24

_label_e87a:
  sta a:_var_06ee_indexed,X      ; $E87A  9D EE 06
  dex                            ; $E87D  CA
  bpl _label_e87a                ; $E87E  10 FA
  lda z:_var_00ec                ; $E880  A5 EC
  clc                            ; $E882  18
  adc #$04                       ; $E883  69 04
  pha                            ; $E885  48
  and #$07                       ; $E886  29 07
  tay                            ; $E888  A8
  pla                            ; $E889  68
  lsr a                          ; $E88A  4A
  lsr a                          ; $E88B  4A
  lsr a                          ; $E88C  4A
  tax                            ; $E88D  AA
  lda a:_data_ea8c_indexed,Y     ; $E88E  B9 8C EA
  sta a:_var_06ee_indexed,X      ; $E891  9D EE 06
  lda #$A6                       ; $E894  A9 A6
  sta a:_var_06ef_indexed,X      ; $E896  9D EF 06
  sta a:_var_06f0_indexed,X      ; $E899  9D F0 06
  lda a:_data_ea94_indexed,Y     ; $E89C  B9 94 EA
  beq _label_e8a4                ; $E89F  F0 03
  sta a:_var_06f1_indexed,X      ; $E8A1  9D F1 06

_label_e8a4:
  lda z:_var_00d2                ; $E8A4  A5 D2
  bmi _label_e8b2                ; $E8A6  30 0A
  lda #$F0                       ; $E8A8  A9 F0
  ldx #$0C                       ; $E8AA  A2 0C

_label_e8ac:
  sta a:_var_027c_indexed,X      ; $E8AC  9D 7C 02
  dex                            ; $E8AF  CA
  bpl _label_e8ac                ; $E8B0  10 FA

_label_e8b2:
  lda a:_var_011c_indexed        ; $E8B2  AD 1C 01
  clc                            ; $E8B5  18
  adc #$23                       ; $E8B6  69 23
  sta a:$02B0                    ; $E8B8  8D B0 02
  sta a:$02B4                    ; $E8BB  8D B4 02
  adc #$08                       ; $E8BE  69 08
  sta a:$02B8                    ; $E8C0  8D B8 02
  sta a:$02BC                    ; $E8C3  8D BC 02
  adc #$08                       ; $E8C6  69 08
  sta a:$02C0                    ; $E8C8  8D C0 02
  sta a:$02C4                    ; $E8CB  8D C4 02
  ldx #$10                       ; $E8CE  A2 10

_label_e8d0:
  lda z:_var_00ed                ; $E8D0  A5 ED
  clc                            ; $E8D2  18
  adc #$48                       ; $E8D3  69 48
  sta a:_var_02b3_indexed,X      ; $E8D5  9D B3 02
  adc #$08                       ; $E8D8  69 08
  sta a:_var_02b7_indexed,X      ; $E8DA  9D B7 02
  txa                            ; $E8DD  8A
  sec                            ; $E8DE  38
  sbc #$08                       ; $E8DF  E9 08
  tax                            ; $E8E1  AA
  bpl _label_e8d0                ; $E8E2  10 EC
  lda a:_var_011c_indexed        ; $E8E4  AD 1C 01
  beq _label_e8ec                ; $E8E7  F0 03
  jmp _label_e96a                ; $E8E9  4C 6A E9

_label_e8ec:
  lda z:_var_0005                ; $E8EC  A5 05
  and #$01                       ; $E8EE  29 01
  beq _label_e8f3                ; $E8F0  F0 01
  rts                            ; $E8F2  60

_label_e8f3:
  inc a:_var_0124                ; $E8F3  EE 24 01
  lda a:_var_011d                ; $E8F6  AD 1D 01
  beq _label_e908                ; $E8F9  F0 0D
  inc z:_var_00ed                ; $E8FB  E6 ED
  lda z:_var_00ed                ; $E8FD  A5 ED
  cmp #$70                       ; $E8FF  C9 70
  bcc _label_e908                ; $E901  90 05
  lda #$00                       ; $E903  A9 00
  sta a:_var_011d                ; $E905  8D 1D 01

_label_e908:
  lda a:_var_011d                ; $E908  AD 1D 01
  bne _label_e91c                ; $E90B  D0 0F
  dec z:_var_00ed                ; $E90D  C6 ED
  lda z:_var_00ed                ; $E90F  A5 ED
  cmp #$20                       ; $E911  C9 20
  bcs _label_e91c                ; $E913  B0 07
  inc z:_var_00ed                ; $E915  E6 ED
  lda #$03                       ; $E917  A9 03
  sta a:_var_011d                ; $E919  8D 1D 01

_label_e91c:
  ldx #$02                       ; $E91C  A2 02

_label_e91e:
  lda z:_var_00ed                ; $E91E  A5 ED
  cmp a:_data_eacc_indexed,X     ; $E920  DD CC EA
  bne _label_e92c                ; $E923  D0 07
  lda a:_var_011f_indexed,X      ; $E925  BD 1F 01
  cmp #$03                       ; $E928  C9 03
  bcs _label_e961                ; $E92A  B0 35

_label_e92c:
  dex                            ; $E92C  CA
  bpl _label_e91e                ; $E92D  10 EF
  ldx #$01                       ; $E92F  A2 01

_label_e931:
  lda z:_var_00ed                ; $E931  A5 ED
  cmp a:_data_eacf_indexed,X     ; $E933  DD CF EA
  bne _label_e94a                ; $E936  D0 12
  clc                            ; $E938  18
  lda a:_var_011f_indexed,X      ; $E939  BD 1F 01
  beq _label_e94a                ; $E93C  F0 0C
  ldy a:_var_0120_indexed,X      ; $E93E  BC 20 01
  beq _label_e94a                ; $E941  F0 07
  adc a:_var_0120_indexed,X      ; $E943  7D 20 01
  cmp #$03                       ; $E946  C9 03
  bcs _label_e961                ; $E948  B0 17

_label_e94a:
  dex                            ; $E94A  CA
  bpl _label_e931                ; $E94B  10 E4

_label_e94d:
  lda a:_var_0124                ; $E94D  AD 24 01
  lsr a                          ; $E950  4A
  and #$03                       ; $E951  29 03
  cmp #$03                       ; $E953  C9 03
  bne _label_e959                ; $E955  D0 02
  lda #$01                       ; $E957  A9 01

_label_e959:
  clc                            ; $E959  18
  adc a:_var_011d                ; $E95A  6D 1D 01
  tax                            ; $E95D  AA
  jmp _label_e9ed                ; $E95E  4C ED E9

_label_e961:
  lda #$02                       ; $E961  A9 02
  sta z:_var_00fe                ; $E963  85 FE
  lda #$00                       ; $E965  A9 00
  sta a:_var_011d                ; $E967  8D 1D 01

_label_e96a:
  lda #$00                       ; $E96A  A9 00
  sta a:_var_0123                ; $E96C  8D 23 01
  lda a:_var_011c_indexed        ; $E96F  AD 1C 01
  cmp #$94                       ; $E972  C9 94
  bcs _label_e9de                ; $E974  B0 68
  cmp #$7C                       ; $E976  C9 7C
  bne _label_e9e5                ; $E978  D0 6B
  lda z:_var_00ed                ; $E97A  A5 ED
  cmp #$24                       ; $E97C  C9 24
  bcc _label_e9a8                ; $E97E  90 28
  cmp #$6C                       ; $E980  C9 6C
  bcs _label_e9a8                ; $E982  B0 24
  sec                            ; $E984  38
  lda z:_var_00ed                ; $E985  A5 ED
  sbc z:_var_00ec                ; $E987  E5 EC
  sbc #$20                       ; $E989  E9 20
  cmp #$20                       ; $E98B  C9 20
  bcs _label_e9e5                ; $E98D  B0 56
  ldx #$00                       ; $E98F  A2 00
  lda z:_var_00ed                ; $E991  A5 ED
  cmp #$48                       ; $E993  C9 48
  bcc _label_e999                ; $E995  90 02
  ldx #$03                       ; $E997  A2 03

_label_e999:
  stx a:_var_011d                ; $E999  8E 1D 01
  inc a:_var_0123                ; $E99C  EE 23 01
  lda z:_var_0005                ; $E99F  A5 05
  and #$04                       ; $E9A1  29 04
  beq _label_e9bc                ; $E9A3  F0 17

_label_e9a5:
  jmp _label_e94d                ; $E9A5  4C 4D E9

_label_e9a8:
  lda a:_var_0122                ; $E9A8  AD 22 01
  bne _label_e9bc                ; $E9AB  D0 0F
  lda #$41                       ; $E9AD  A9 41
  sta a:_var_0122                ; $E9AF  8D 22 01
  jsr _func_ee3d                 ; $E9B2  20 3D EE
  jsr _func_ee3d                 ; $E9B5  20 3D EE
  lda #$01                       ; $E9B8  A9 01
  sta z:_var_00fd                ; $E9BA  85 FD

_label_e9bc:
  lda z:_var_0005                ; $E9BC  A5 05
  and #$03                       ; $E9BE  29 03
  bne _label_e9a5                ; $E9C0  D0 E3
  inc a:_var_0124                ; $E9C2  EE 24 01
  lda a:_var_011d                ; $E9C5  AD 1D 01
  beq _label_e9d6                ; $E9C8  F0 0C
  inc z:_var_00ed                ; $E9CA  E6 ED
  lda z:_var_00ed                ; $E9CC  A5 ED
  cmp #$90                       ; $E9CE  C9 90
  bne _label_e9a5                ; $E9D0  D0 D3
  inc a:_var_011e                ; $E9D2  EE 1E 01
  rts                            ; $E9D5  60

_label_e9d6:
  dec z:_var_00ed                ; $E9D6  C6 ED
  bpl _label_e9a5                ; $E9D8  10 CB
  inc a:_var_011e                ; $E9DA  EE 1E 01
  rts                            ; $E9DD  60

_label_e9de:
  ldx #$07                       ; $E9DE  A2 07
  dec a:_var_011e                ; $E9E0  CE 1E 01
  bne _label_e9ed                ; $E9E3  D0 08

_label_e9e5:
  inc a:_var_011c_indexed        ; $E9E5  EE 1C 01
  inc a:_var_011c_indexed        ; $E9E8  EE 1C 01
  ldx #$06                       ; $E9EB  A2 06

_label_e9ed:
  lda a:_data_ea9c_indexed,X     ; $E9ED  BD 9C EA
  sta a:$02B1                    ; $E9F0  8D B1 02
  lda a:_data_eaa4_indexed,X     ; $E9F3  BD A4 EA
  sta a:$02B5                    ; $E9F6  8D B5 02
  lda a:_data_eaac_indexed,X     ; $E9F9  BD AC EA
  sta a:$02B9                    ; $E9FC  8D B9 02
  lda a:_data_eab4_indexed,X     ; $E9FF  BD B4 EA
  sta a:$02BD                    ; $EA02  8D BD 02
  lda a:_data_eabc_indexed,X     ; $EA05  BD BC EA
  sta a:$02C1                    ; $EA08  8D C1 02
  lda a:_data_eac4_indexed,X     ; $EA0B  BD C4 EA
  sta a:_var_02c5                ; $EA0E  8D C5 02
  lda #$02                       ; $EA11  A9 02
  ldy a:_var_011c_indexed        ; $EA13  AC 1C 01
  beq _label_ea1c                ; $EA16  F0 04
  cpy #$7C                       ; $EA18  C0 7C
  bne _label_ea23                ; $EA1A  D0 07

_label_ea1c:
  ldy a:_var_011d                ; $EA1C  AC 1D 01
  beq _label_ea23                ; $EA1F  F0 02
  lda #$42                       ; $EA21  A9 42

_label_ea23:
  ldx #$14                       ; $EA23  A2 14

_label_ea25:
  sta a:_var_02b2_indexed,X      ; $EA25  9D B2 02
  dex                            ; $EA28  CA
  dex                            ; $EA29  CA
  dex                            ; $EA2A  CA
  dex                            ; $EA2B  CA
  bpl _label_ea25                ; $EA2C  10 F7
  rts                            ; $EA2E  60

_func_ea2f:
  ldx #$07                       ; $EA2F  A2 07
  lda #$00                       ; $EA31  A9 00

_label_ea33:
  sta a:_var_011c_indexed,X      ; $EA33  9D 1C 01
  dex                            ; $EA36  CA
  bpl _label_ea33                ; $EA37  10 FA
  lda #$20                       ; $EA39  A9 20
  ldx z:_var_00ed                ; $EA3B  A6 ED
  inx                            ; $EA3D  E8
  beq _label_ea42                ; $EA3E  F0 02
  lda #$70                       ; $EA40  A9 70

_label_ea42:
  sta z:_var_00ed                ; $EA42  85 ED
  ldx #$17                       ; $EA44  A2 17

_label_ea46:
  lda a:_data_cb7e_indexed,X     ; $EA46  BD 7E CB
  sta a:_var_0264_indexed,X      ; $EA49  9D 64 02
  dex                            ; $EA4C  CA
  bpl _label_ea46                ; $EA4D  10 F7
  rts                            ; $EA4F  60

_func_ea50:
  lda a:_var_0123                ; $EA50  AD 23 01
  beq _label_ea57                ; $EA53  F0 02
  inc z:_var_00ed                ; $EA55  E6 ED

_label_ea57:
  rts                            ; $EA57  60

_func_ea58:
  lda a:_var_0123                ; $EA58  AD 23 01
  beq _label_ea57                ; $EA5B  F0 FA
  dec z:_var_00ed                ; $EA5D  C6 ED
  rts                            ; $EA5F  60

_data_ea60_indexed:
.byte $b7, $b7, $b7, $b7, $bf, $bf, $c7, $c7 ; $EA60

_data_ea68_indexed:
.byte $26, $2c, $2c, $27, $2d, $2d ; $EA68

_data_ea6e_indexed:
.byte $27, $2d, $2d, $26, $2c, $2c ; $EA6E

_data_ea74_indexed:
.byte $28, $2e, $32, $29, $2f, $33 ; $EA74

_data_ea7a_indexed:
.byte $29, $2f, $33, $28, $2e, $32 ; $EA7A

_data_ea80_indexed:
.byte $2a, $30, $34, $2b, $31, $35 ; $EA80

_data_ea86_indexed:
.byte $2b, $31, $35, $2a, $30, $34 ; $EA86

_data_ea8c_indexed:
.byte $a6, $a7, $a8, $a9, $aa, $ab, $ac, $ad ; $EA8C

_data_ea94_indexed:
.byte $00, $dd, $de, $df, $e0, $e1, $e2, $e3 ; $EA94

_data_ea9c_indexed:
.byte $00, $06, $06, $01, $07, $07, $1a, $b9 ; $EA9C

_data_eaa4_indexed:
.byte $01, $07, $07, $00, $06, $06, $1b, $b9 ; $EAA4

_data_eaac_indexed:
.byte $02, $08, $0c, $03, $09, $0d, $1c, $20 ; $EAAC

_data_eab4_indexed:
.byte $03, $09, $0d, $02, $08, $0c, $1d, $21 ; $EAB4

_data_eabc_indexed:
.byte $04, $0a, $0e, $05, $0b, $0f, $1e, $22 ; $EABC

_data_eac4_indexed:
.byte $05, $0b, $0f, $04, $0a, $0e, $1f, $23 ; $EAC4

_data_eacc_indexed:
.byte $38, $48, $58              ; $EACC

_data_eacf_indexed:
.byte $40, $50                   ; $EACF

_func_ead1:
  lda #$00                       ; $EAD1  A9 00
  sta z:_var_00e3                ; $EAD3  85 E3
  sta a:_var_012b                ; $EAD5  8D 2B 01
  dec a:_var_012c                ; $EAD8  CE 2C 01
  jsr _func_f3e8                 ; $EADB  20 E8 F3

_label_eade:
  jsr _func_e049                 ; $EADE  20 49 E0
  and #$C0                       ; $EAE1  29 C0
  beq _label_eade                ; $EAE3  F0 F9

_label_eae5:
  jsr _func_e02c                 ; $EAE5  20 2C E0
  jsr _func_e049                 ; $EAE8  20 49 E0
  and #$C0                       ; $EAEB  29 C0
  beq _label_eb0d                ; $EAED  F0 1E
  inc z:_var_00e3                ; $EAEF  E6 E3
  lda z:_var_00e3                ; $EAF1  A5 E3
  cmp #$14                       ; $EAF3  C9 14
  bcc _label_eaf9                ; $EAF5  90 02
  dec z:_var_00e3                ; $EAF7  C6 E3

_label_eaf9:
  lda z:_var_00e3                ; $EAF9  A5 E3
  lsr a                          ; $EAFB  4A
  lsr a                          ; $EAFC  4A
  sta a:_var_0125                ; $EAFD  8D 25 01
  cmp #$01                       ; $EB00  C9 01
  bne _label_eb07                ; $EB02  D0 03
  inc a:_var_0126                ; $EB04  EE 26 01

_label_eb07:
  jsr _func_eb27                 ; $EB07  20 27 EB
  jmp _label_eae5                ; $EB0A  4C E5 EA

_label_eb0d:
  jsr _func_e02c                 ; $EB0D  20 2C E0
  dec a:_var_0125                ; $EB10  CE 25 01
  bne _label_eb18                ; $EB13  D0 03
  inc a:_var_0126                ; $EB15  EE 26 01

_label_eb18:
  bmi _label_eb20                ; $EB18  30 06
  jsr _func_eb27                 ; $EB1A  20 27 EB
  jmp _label_eb0d                ; $EB1D  4C 0D EB

_label_eb20:
  lda #$01                       ; $EB20  A9 01
  sta z:_var_00fe                ; $EB22  85 FE
  lda z:_var_00e3                ; $EB24  A5 E3
  rts                            ; $EB26  60

_func_eb27:
  lda #$09                       ; $EB27  A9 09
  sta z:_var_00e6                ; $EB29  85 E6
  ldx a:_var_0125                ; $EB2B  AE 25 01
  ldy a:_data_eb66_indexed,X     ; $EB2E  BC 66 EB
  ldx #$27                       ; $EB31  A2 27

_label_eb33:
  lda z:_var_00e6                ; $EB33  A5 E6
  lsr a                          ; $EB35  4A
  lda #$D8                       ; $EB36  A9 D8
  bcc _label_eb3c                ; $EB38  90 02
  lda #$E0                       ; $EB3A  A9 E0

_label_eb3c:
  sta a:_var_0200_indexed,X      ; $EB3C  9D 00 02
  dex                            ; $EB3F  CA
  lda #$00                       ; $EB40  A9 00
  sta a:_var_0200_indexed,X      ; $EB42  9D 00 02
  dex                            ; $EB45  CA
  lda a:_data_eb6b_indexed,Y     ; $EB46  B9 6B EB
  pha                            ; $EB49  48
  sta a:_var_0200_indexed,X      ; $EB4A  9D 00 02
  dex                            ; $EB4D  CA
  dey                            ; $EB4E  88
  pla                            ; $EB4F  68
  beq _label_eb5b                ; $EB50  F0 09
  lda z:_var_00e6                ; $EB52  A5 E6
  and #$FE                       ; $EB54  29 FE
  asl a                          ; $EB56  0A
  asl a                          ; $EB57  0A
  adc #$A7                       ; $EB58  69 A7
.byte $2c                        ; $EB5A  2C  branch into instruction detected: bit a:_data_f0a8+1

_label_eb5b:
.byte $a9, $f0                   ; $EB5B  A9 F0
  sta a:_var_0200_indexed,X      ; $EB5D  9D 00 02
  dex                            ; $EB60  CA
  dec z:_var_00e6                ; $EB61  C6 E6
  bpl _label_eb33                ; $EB63  10 CE
  rts                            ; $EB65  60

_data_eb66_indexed:
.byte $09, $13, $1d, $27, $31    ; $EB66

_data_eb6b_indexed:
.byte $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $e0, $e1, $e2, $e3, $e4, $e5 ; $EB6B
.byte $e2, $e3, $e4, $e5, $00, $00, $e0, $e1, $e6, $e7, $e6, $e7, $e6, $e7, $00, $00 ; $EB7B
.byte $00, $00, $e0, $e1, $e8, $e9, $ea, $eb, $00, $00, $00, $00, $00, $00, $ec, $ed ; $EB8B
.byte $e8, $e9                   ; $EB9B

_func_eb9d:
  lda a:_var_0126                ; $EB9D  AD 26 01
  beq _label_ebe0                ; $EBA0  F0 3E
  lda z:_var_0000_indexed        ; $EBA2  A5 00
  ora #$04                       ; $EBA4  09 04
  sta PPU_CTRL                   ; $EBA6  8D 00 20
  ldy #$00                       ; $EBA9  A0 00
  sty a:_var_0126                ; $EBAB  8C 26 01
  lda a:_var_0125                ; $EBAE  AD 25 01
  beq _label_ebb5                ; $EBB1  F0 02
  ldy #$0C                       ; $EBB3  A0 0C

_label_ebb5:
  ldx #$22                       ; $EBB5  A2 22
  lda #$9B                       ; $EBB7  A9 9B
  jsr _func_e0ef                 ; $EBB9  20 EF E0
  ldx #$06                       ; $EBBC  A2 06

_label_ebbe:
  lda a:_data_ebe1_indexed,Y     ; $EBBE  B9 E1 EB
  sta PPU_DATA                   ; $EBC1  8D 07 20
  iny                            ; $EBC4  C8
  dex                            ; $EBC5  CA
  bne _label_ebbe                ; $EBC6  D0 F6
  ldx #$22                       ; $EBC8  A2 22
  lda #$9C                       ; $EBCA  A9 9C
  jsr _func_e0ef                 ; $EBCC  20 EF E0
  ldx #$06                       ; $EBCF  A2 06

_label_ebd1:
  lda a:_data_ebe1_indexed,Y     ; $EBD1  B9 E1 EB
  sta PPU_DATA                   ; $EBD4  8D 07 20
  iny                            ; $EBD7  C8
  dex                            ; $EBD8  CA
  bne _label_ebd1                ; $EBD9  D0 F6
  lda z:_var_0000_indexed        ; $EBDB  A5 00
  sta PPU_CTRL                   ; $EBDD  8D 00 20

_label_ebe0:
  rts                            ; $EBE0  60

_data_ebe1_indexed:
.byte $c6, $ce, $ce, $ce, $ce, $ce, $c7, $cf, $cf, $cf, $cf, $cf, $5e, $62, $62, $62 ; $EBE1
.byte $62, $62, $5f, $63, $63, $63, $63, $63 ; $EBF1

_func_ebf9:
  lda z:_var_0005                ; $EBF9  A5 05
  and #$03                       ; $EBFB  29 03
  beq _label_ebe0                ; $EBFD  F0 E1
  tay                            ; $EBFF  A8
  dey                            ; $EC00  88
  lda a:_var_00c9_indexed,Y      ; $EC01  B9 C9 00
  beq _label_ec4a                ; $EC04  F0 44
  sty z:_var_00e8                ; $EC06  84 E8
  tay                            ; $EC08  A8
  lda #$10                       ; $EC09  A9 10
  sta z:_var_00ff                ; $EC0B  85 FF
  iny                            ; $EC0D  C8
  lda #$03                       ; $EC0E  A9 03
  sta z:_var_00ea                ; $EC10  85 EA
  lda z:_var_tableUpperOrLower                ; $EC12  A5 BF
  asl a                          ; $EC14  0A
  adc z:_var_tableUpperOrLower                ; $EC15  65 BF
  ldx z:_var_00e8                ; $EC17  A6 E8
  beq _label_ec22                ; $EC19  F0 07
  adc #$09                       ; $EC1B  69 09
  dex                            ; $EC1D  CA
  beq _label_ec22                ; $EC1E  F0 02
  adc #$09                       ; $EC20  69 09

_label_ec22:
  tax                            ; $EC22  AA

_label_ec23:
  lda #$21                       ; $EC23  A9 21
  sta PPU_ADDR                   ; $EC25  8D 06 20
  lda a:_data_ec65_indexed,X     ; $EC28  BD 65 EC
  sta PPU_ADDR                   ; $EC2B  8D 06 20
  lda #$04                       ; $EC2E  A9 04
  sta z:_var_00e9                ; $EC30  85 E9

_label_ec32:
  lda a:_data_ec4b_indexed,Y     ; $EC32  B9 4B EC
  sta PPU_DATA                   ; $EC35  8D 07 20
  iny                            ; $EC38  C8
  dec z:_var_00e9                ; $EC39  C6 E9
  bne _label_ec32                ; $EC3B  D0 F5
  inx                            ; $EC3D  E8
  dec z:_var_00ea                ; $EC3E  C6 EA
  bne _label_ec23                ; $EC40  D0 E1
  lda a:_data_ec4b_indexed,Y     ; $EC42  B9 4B EC
  ldy z:_var_00e8                ; $EC45  A4 E8
  sta a:_var_00c9_indexed,Y      ; $EC47  99 C9 00

_label_ec4a:
  rts                            ; $EC4A  60

_data_ec4b_indexed:
.byte $24, $56, $57, $24, $24, $5c, $5d, $24, $24, $a2, $a3, $24, $0c, $7f, $80, $81 ; $EC4B
.byte $82, $83, $84, $85, $86, $87, $88, $89, $8a, $00 ; $EC5B

_data_ec65_indexed:
.byte $70, $90, $b0, $2d, $4d, $6d, $8b, $ab, $cb, $70, $90, $b0, $b0, $d0, $f0, $8b ; $EC65
.byte $ab, $cb, $70, $90, $b0, $33, $53, $73, $97, $b7, $d7 ; $EC75

_func_ec80:
  lda z:_var_00cc                ; $EC80  A5 CC
  beq _label_ec88                ; $EC82  F0 04
  lda #$08                       ; $EC84  A9 08
  sta z:_var_00fe                ; $EC86  85 FE

_label_ec88:
  lda #$00                       ; $EC88  A9 00
  sta z:_var_00cc                ; $EC8A  85 CC
  rts                            ; $EC8C  60

_func_ec8d:
  lda z:_var_0005                ; $EC8D  A5 05
  and #$03                       ; $EC8F  29 03
  beq _label_ec94                ; $EC91  F0 01
  rts                            ; $EC93  60

_label_ec94:
  lda z:_var_00ee                ; $EC94  A5 EE
  sta a:$02F7                    ; $EC96  8D F7 02
  clc                            ; $EC99  18
  adc #$08                       ; $EC9A  69 08
  sta a:$02FB                    ; $EC9C  8D FB 02
  lda z:_var_00ef                ; $EC9F  A5 EF
  beq _label_ecaf                ; $ECA1  F0 0C
  inc z:_var_00ee                ; $ECA3  E6 EE
  lda z:_var_00ee                ; $ECA5  A5 EE
  cmp #$A0                       ; $ECA7  C9 A0
  bcc _label_ecaf                ; $ECA9  90 04
  lda #$00                       ; $ECAB  A9 00
  sta z:_var_00ef                ; $ECAD  85 EF

_label_ecaf:
  lda z:_var_00ef                ; $ECAF  A5 EF
  bne _label_ecc5                ; $ECB1  D0 12
  lda #$00                       ; $ECB3  A9 00
  sta z:_var_00ef                ; $ECB5  85 EF
  dec z:_var_00ee                ; $ECB7  C6 EE
  lda z:_var_00ee                ; $ECB9  A5 EE
  cmp #$74                       ; $ECBB  C9 74
  bcs _label_ecc5                ; $ECBD  B0 06
  inc z:_var_00ee                ; $ECBF  E6 EE
  lda #$03                       ; $ECC1  A9 03
  sta z:_var_00ef                ; $ECC3  85 EF

_label_ecc5:
  ldx #$07                       ; $ECC5  A2 07
  lda #$24                       ; $ECC7  A9 24

_label_ecc9:
  sta a:_var_062e_indexed,X      ; $ECC9  9D 2E 06
  dex                            ; $ECCC  CA
  bpl _label_ecc9                ; $ECCD  10 FA
  ldx z:_var_00ee                ; $ECCF  A6 EE
  inx                            ; $ECD1  E8
  txa                            ; $ECD2  8A
  lsr a                          ; $ECD3  4A
  lsr a                          ; $ECD4  4A
  lsr a                          ; $ECD5  4A
  tay                            ; $ECD6  A8
  txa                            ; $ECD7  8A
  and #$07                       ; $ECD8  29 07
  tax                            ; $ECDA  AA
  lda a:_data_ecee_indexed,X     ; $ECDB  BD EE EC
  sta a:_var_0620_indexed,Y      ; $ECDE  99 20 06
  lda a:_data_ecf6_indexed,X     ; $ECE1  BD F6 EC
  sta a:_var_0621_indexed,Y      ; $ECE4  99 21 06
  lda a:_data_ecfe_indexed,X     ; $ECE7  BD FE EC
  sta a:_var_0622_indexed,Y      ; $ECEA  99 22 06
  rts                            ; $ECED  60

_data_ecee_indexed:
.byte $a6, $a7, $a8, $a9, $aa, $ab, $ac, $ad ; $ECEE

_data_ecf6_indexed:
.byte $e2, $e3, $a6, $a6, $a6, $a6, $a6, $a6 ; $ECF6

_data_ecfe_indexed:
.byte $24, $24, $dd, $de, $df, $e0, $e1, $e2 ; $ECFE

_func_ed06:
  ldx z:_var_00bd                ; $ED06  A6 BD
  lda a:_data_edae_indexed,X     ; $ED08  BD AE ED
  tax                            ; $ED0B  AA

_label_ed0c:
  lda a:_data_ed2e_indexed,X     ; $ED0C  BD 2E ED
  sta PPU_ADDR                   ; $ED0F  8D 06 20
  lda a:_data_ed3e_indexed,X     ; $ED12  BD 3E ED
  sta PPU_ADDR                   ; $ED15  8D 06 20
  ldy a:_data_ed9e_indexed,X     ; $ED18  BC 9E ED
  lda #$08                       ; $ED1B  A9 08
  sta z:_var_00e3                ; $ED1D  85 E3

_label_ed1f:
  lda a:_data_ed4e_indexed,Y     ; $ED1F  B9 4E ED
  sta PPU_DATA                   ; $ED22  8D 07 20
  dey                            ; $ED25  88
  dec z:_var_00e3                ; $ED26  C6 E3
  bpl _label_ed1f                ; $ED28  10 F5
  dex                            ; $ED2A  CA
  bpl _label_ed0c                ; $ED2B  10 DF
  rts                            ; $ED2D  60

_data_ed2e_indexed:
.byte $20, $20, $20, $20, $21, $21, $21, $21, $22, $22, $23, $23, $21, $21, $22, $22 ; $ED2E

_data_ed3e_indexed:
.byte $81, $a1, $c1, $e1, $41, $61, $81, $a1, $c1, $e1, $01, $21, $c1, $e1, $01, $21 ; $ED3E

_data_ed4e_indexed:
.byte $30, $24, $0d, $19, $18, $1d, $0c, $24, $30, $24, $0d, $19, $1e, $01, $0c, $24 ; $ED4E
.byte $30, $24, $0d, $19, $1e, $02, $0c, $24, $14, $0e, $0e, $0e, $0e, $0e, $0e, $0f ; $ED5E
.byte $16, $00, $00, $00, $00, $00, $00, $10, $1a, $13, $13, $13, $13, $13, $13, $11 ; $ED6E
.byte $30, $0d, $15, $15, $0a, $0b, $0c, $24, $14, $0e, $0e, $0f, $24, $24, $24, $24 ; $ED7E
.byte $16, $00, $00, $10, $24, $24, $24, $24, $1a, $13, $13, $11, $24, $24, $24, $24 ; $ED8E

_data_ed9e_indexed:
.byte $07, $1f, $27, $2f, $0f, $1f, $27, $2f, $37, $3f, $47, $4f, $17, $1f, $27, $2f ; $ED9E

_data_edae_indexed:
.byte $0b, $0f                   ; $EDAE

_func_edb0:
  lda a:_var_0135                ; $EDB0  AD 35 01
  bne _label_edb6                ; $EDB3  D0 01
  rts                            ; $EDB5  60

_label_edb6:
  dec a:_var_0135                ; $EDB6  CE 35 01
  ldy z:_var_player1or2                ; $EDB9  A4 BE
  ldx #$22                       ; $EDBB  A2 22
  lda #$2E                       ; $EDBD  A9 2E
  jsr _func_e0ef                 ; $EDBF  20 EF E0
  lda a:_var_0135                ; $EDC2  AD 35 01
  and #$20                       ; $EDC5  29 20
  bne _label_edd4                ; $EDC7  D0 0B
  ldx #$08                       ; $EDC9  A2 08
  lda #$24                       ; $EDCB  A9 24

_label_edcd:
  sta PPU_DATA                   ; $EDCD  8D 07 20
  dex                            ; $EDD0  CA
  bne _label_edcd                ; $EDD1  D0 FA
  rts                            ; $EDD3  60

_label_edd4:
  ldx #$06                       ; $EDD4  A2 06

_label_edd6:
  lda a:_data_ede6_indexed,X     ; $EDD6  BD E6 ED
  sta PPU_DATA                   ; $EDD9  8D 07 20
  dex                            ; $EDDC  CA
  bpl _label_edd6                ; $EDDD  10 F7
  ldx z:_var_player1or2                ; $EDDF  A6 BE
  inx                            ; $EDE1  E8
  stx PPU_DATA                   ; $EDE2  8E 07 20
  rts                            ; $EDE5  60

_data_ede6_indexed:
.byte $24, $1b, $12, $ee, $0a, $15, $19 ; $EDE6

_func_eded:
  lda a:_var_0156                ; $EDED  AD 56 01
  beq _label_ee2b                ; $EDF0  F0 39

_func_edf2:
  lda #$00                       ; $EDF2  A9 00
  sta a:_var_0156                ; $EDF4  8D 56 01
  ldy z:_var_player1or2                ; $EDF7  A4 BE
  ldx a:_data_ee37_indexed,Y     ; $EDF9  BE 37 EE
  lda a:_data_ee39_indexed,Y     ; $EDFC  B9 39 EE
  jsr _func_e0ef                 ; $EDFF  20 EF E0
  ldx #$05                       ; $EE02  A2 05
  lda a:_data_ee3b_indexed,Y     ; $EE04  B9 3B EE
  tay                            ; $EE07  A8

_label_ee08:
  lda a:_var_1pScore5Bytes,Y      ; $EE08  B9 00 01
  sta PPU_DATA                   ; $EE0B  8D 07 20
  iny                            ; $EE0E  C8
  dex                            ; $EE0F  CA
  bne _label_ee08                ; $EE10  D0 F6
  ldx #$20                       ; $EE12  A2 20
  lda #$C2                       ; $EE14  A9 C2
  jsr _func_e0ef                 ; $EE16  20 EF E0
  ldx z:_var_00bc                ; $EE19  A6 BC
  lda a:_data_ee3b_indexed,X     ; $EE1B  BD 3B EE
  tax                            ; $EE1E  AA
  ldy #$05                       ; $EE1F  A0 05

_label_ee21:
  lda a:_var_TopScore5Bytes,X      ; $EE21  BD 0E 01
  sta PPU_DATA                   ; $EE24  8D 07 20
  inx                            ; $EE27  E8
  dey                            ; $EE28  88
  bne _label_ee21                ; $EE29  D0 F6

_label_ee2b:
  ldx z:_var_player1or2                ; $EE2B  A6 BE
  ldy a:_var_0151_indexed,X      ; $EE2D  BC 51 01
  ldx #$23                       ; $EE30  A2 23
  lda #$07                       ; $EE32  A9 07
  jmp _func_e0f6                 ; $EE34  4C F6 E0

_data_ee37_indexed:
.byte $21, $22                   ; $EE37

_data_ee39_indexed:
.byte $82, $02                   ; $EE39

_data_ee3b_indexed:
.byte $00, $05                   ; $EE3B

_func_ee3d:
  ldx z:_var_0004                ; $EE3D  A6 04
  beq _label_ee42                ; $EE3F  F0 01
  rts                            ; $EE41  60

_label_ee42:
  inc a:_var_0156                ; $EE42  EE 56 01
  ldx a:_var_014b                ; $EE45  AE 4B 01
  beq _func_ee4d                 ; $EE48  F0 03
  jsr _func_ee4d                 ; $EE4A  20 4D EE

; scoring related
_func_ee4d:
  pha                            ; $EE4D  48
  ldx z:_var_player1or2                ; $EE4E  A6 BE
  ldy a:_data_eedb_indexed,X     ; $EE50  BC DB EE
  clc                            ; $EE53  18
  adc #$04                       ; $EE54  69 04
  tax                            ; $EE56  AA
  lda #$05                       ; $EE57  A9 05
  sta z:_var_00eb                ; $EE59  85 EB

_label_ee5b:
  lda a:_var_1pScore5Bytes,Y      ; $EE5B  B9 00 01
  adc a:_data_eedd_indexed,X     ; $EE5E  7D DD EE
  cmp #$0A                       ; $EE61  C9 0A
  bcc _label_ee67                ; $EE63  90 02
  sbc #$0A                       ; $EE65  E9 0A

_label_ee67:
  sta a:_var_1pScore5Bytes,Y      ; $EE67  99 00 01
  dey                            ; $EE6A  88
  dex                            ; $EE6B  CA
  dec z:_var_00eb                ; $EE6C  C6 EB
  bne _label_ee5b                ; $EE6E  D0 EB
  lda #$00                       ; $EE70  A9 00
  sta a:_var_014a                ; $EE72  8D 4A 01
  ldx z:_var_player1or2                ; $EE75  A6 BE
  ldy a:_data_ee3b_indexed,X     ; $EE77  BC 3B EE
  lda a:_var_1pScore5Bytes,Y      ; $EE7A  B9 00 01
  cmp #$01                       ; $EE7D  C9 01
  bne _label_ee8b                ; $EE7F  D0 0A
  lda a:_var_1pScoreTenThousands,Y      ; $EE81  B9 01 01
  cmp #$05                       ; $EE84  C9 05
  bcs _label_ee8b                ; $EE86  B0 03
  inc a:_var_014a                ; $EE88  EE 4A 01

_label_ee8b:
  lda a:_var_010a_indexed,X      ; $EE8B  BD 0A 01
  bne _label_ee9d                ; $EE8E  D0 0D
  lda a:_var_1pScoreTenThousands,Y      ; $EE90  B9 01 01
  cmp #$05                       ; $EE93  C9 05
  bcc _label_ee9d                ; $EE95  90 06
  inc a:_var_010a_indexed,X      ; $EE97  FE 0A 01
  inc a:_var_0151_indexed,X      ; $EE9A  FE 51 01

_label_ee9d:
  ldx z:_var_player1or2                ; $EE9D  A6 BE
  ldy a:_data_ee3b_indexed,X     ; $EE9F  BC 3B EE
  ldx z:_var_00bc                ; $EEA2  A6 BC
  lda a:_data_ee3b_indexed,X     ; $EEA4  BD 3B EE
  tax                            ; $EEA7  AA
  lda #$05                       ; $EEA8  A9 05
  sta z:_var_00eb                ; $EEAA  85 EB

_label_eeac:
  lda a:_var_TopScore5Bytes,X      ; $EEAC  BD 0E 01
  cmp a:_var_1pScore5Bytes,Y      ; $EEAF  D9 00 01
  bcc _label_eebe                ; $EEB2  90 0A
  bne _label_eebc                ; $EEB4  D0 06
  inx                            ; $EEB6  E8
  iny                            ; $EEB7  C8
  dec z:_var_00eb                ; $EEB8  C6 EB
  bne _label_eeac                ; $EEBA  D0 F0

_label_eebc:
  pla                            ; $EEBC  68
  rts                            ; $EEBD  60

_label_eebe:
  ldx z:_var_player1or2                ; $EEBE  A6 BE
  ldy a:_data_ee3b_indexed,X     ; $EEC0  BC 3B EE
  ldx z:_var_00bc                ; $EEC3  A6 BC
  lda a:_data_ee3b_indexed,X     ; $EEC5  BD 3B EE
  tax                            ; $EEC8  AA
  lda #$05                       ; $EEC9  A9 05
  sta z:_var_00eb                ; $EECB  85 EB

_label_eecd:
  lda a:_var_1pScore5Bytes,Y      ; $EECD  B9 00 01
  sta a:_var_TopScore5Bytes,X      ; $EED0  9D 0E 01
  inx                            ; $EED3  E8
  iny                            ; $EED4  C8
  dec z:_var_00eb                ; $EED5  C6 EB
  bne _label_eecd                ; $EED7  D0 F4
  pla                            ; $EED9  68
  rts                            ; $EEDA  60

; offset for player 1 vs 2 score
_data_eedb_indexed:
.byte $04, $09                   ; $EEDB

; scoring table
; base: offset from table at $DB88 ($1e, $37, $1e, $27, $2a, $32, $3a, $43, $4b, $54, $5d, $65)
; (multiple offset tables, another at $D9D6)
; then add 0x04 to start with tens digit, working backwards (hundreds, thousands...)
; so e.g., if offset = $1e then score = $eefb-$eeff = 500
_data_eedd_indexed:
.byte $00, $00, $00, $00, $01, $00, $00, $07, $07, $07, $00, $00, $00, $01, $00, $00 ; $EEDD
.byte $00, $00, $02, $00, $00, $00, $00, $03, $00, $00, $00, $00, $04, $00, $00, $00 ; $EEED
.byte $00, $05, $00, $00, $00, $00, $06, $00, $00, $00, $00, $07, $00, $00, $00, $00 ; $EEFD
.byte $08, $00, $00, $00, $00, $09, $00, $00, $00, $01, $00, $00, $00, $00, $03, $03 ; $EF0D
.byte $03, $00, $00, $05, $00, $00, $00, $00, $00, $00, $00 ; $EF1D

; upper table flags reset check?
_func_ef28:
  ldx z:_var_tableUpperOrLower                ; $EF28  A6 BF
  beq _label_ef60                ; $EF2A  F0 34
  dex                            ; $EF2C  CA
  beq _label_ef34                ; $EF2D  F0 05

_label_ef2f:
  lda #$00                       ; $EF2F  A9 00
  sta z:_var_00d3                ; $EF31  85 D3
  rts                            ; $EF33  60

_label_ef34:
  lda z:_var_00d3                ; $EF34  A5 D3
  beq _label_ef2f                ; $EF36  F0 F7
  ldx #$08                       ; $EF38  A2 08
  stx z:_var_00ff                ; $EF3A  86 FF
  ora a:_var_lowerTableCards                ; $EF3C  0D 28 01
  cmp a:_var_lowerTableCards                ; $EF3F  CD 28 01
  beq _label_ef2f                ; $EF42  F0 EB
  sta a:_var_lowerTableCards                ; $EF44  8D 28 01
  ldx #$00                       ; $EF47  A2 00

_label_ef49:
  asl z:_var_00d3                ; $EF49  06 D3
  bcs _label_ef50                ; $EF4B  B0 03
  inx                            ; $EF4D  E8
  bne _label_ef49                ; $EF4E  D0 F9

_label_ef50:
  jsr _func_ef79                 ; $EF50  20 79 EF
  lda a:_var_lowerTableCards                ; $EF53  AD 28 01
  cmp #$F8                       ; $EF56  C9 F8
  bne _label_ef5f                ; $EF58  D0 05
  inc z:_var_00f0                ; $EF5A  E6 F0
  inc a:_var_0133                ; $EF5C  EE 33 01

_label_ef5f:
  rts                            ; $EF5F  60

; upper table flags reset?
_label_ef60:
  lda z:_var_00d3                ; $EF60  A5 D3
  beq _label_ef5f                ; $EF62  F0 FB
  lda #$00                       ; $EF64  A9 00
  sta z:_var_00d3                ; $EF66  85 D3
  lda #$08                       ; $EF68  A9 08
  sta z:_var_00ff                ; $EF6A  85 FF
  ldx a:_var_upperTableFlags        ; $EF6C  AE 30 01
  cpx #$F0                       ; $EF6F  E0 F0
  bne _label_ef5f                ; $EF71  D0 EC
  sta a:_var_upperTableFlags        ; $EF73  8D 30 01
  jmp _func_f03f                 ; $EF76  4C 3F F0

_func_ef79:
  lda #$20                       ; $EF79  A9 20
  sta PPU_ADDR                   ; $EF7B  8D 06 20
  lda a:_data_efba_indexed,X     ; $EF7E  BD BA EF
  sta PPU_ADDR                   ; $EF81  8D 06 20
  lda a:_data_efc9_indexed,X     ; $EF84  BD C9 EF
  sta PPU_DATA                   ; $EF87  8D 07 20
  lda #$A7                       ; $EF8A  A9 A7
  sta PPU_DATA                   ; $EF8C  8D 07 20
  lda #$20                       ; $EF8F  A9 20
  sta PPU_ADDR                   ; $EF91  8D 06 20
  lda a:_data_efbf_indexed,X     ; $EF94  BD BF EF
  sta PPU_ADDR                   ; $EF97  8D 06 20
  ldy #$AC                       ; $EF9A  A0 AC
  sty PPU_DATA                   ; $EF9C  8C 07 20
  iny                            ; $EF9F  C8
  sty PPU_DATA                   ; $EFA0  8C 07 20
  lda #$20                       ; $EFA3  A9 20
  sta PPU_ADDR                   ; $EFA5  8D 06 20
  lda a:_data_efc4_indexed,X     ; $EFA8  BD C4 EF
  sta PPU_ADDR                   ; $EFAB  8D 06 20
  lda #$B0                       ; $EFAE  A9 B0
  sta PPU_DATA                   ; $EFB0  8D 07 20
  lda a:_data_efce_indexed,X     ; $EFB3  BD CE EF
  sta PPU_DATA                   ; $EFB6  8D 07 20
  rts                            ; $EFB9  60

_data_efba_indexed:
.byte $6d, $6f, $71, $73, $75    ; $EFBA

_data_efbf_indexed:
.byte $8d, $8f, $91, $93, $95    ; $EFBF

_data_efc4_indexed:
.byte $ad, $af, $b1, $b3, $b5    ; $EFC4

_data_efc9_indexed:
.byte $a6, $a8, $a9, $aa, $ab    ; $EFC9

_data_efce_indexed:
.byte $b1, $b2, $b3, $b4, $b5    ; $EFCE

; flags hit check
; $CE tracks which flag was hit
_func_efd3:
  lda z:_var_00ce                ; $EFD3  A5 CE
  bne _label_efd8                ; $EFD5  D0 01
  rts                            ; $EFD7  60

_label_efd8:
  lda #$04                       ; $EFD8  A9 04
  sta z:_var_00ff                ; $EFDA  85 FF

; update flags ($0130 upper table, $0131 lower table)
_label_efdc:
  ldx z:_var_tableUpperOrLower                ; $EFDC  A6 BF
  lda a:_var_upperTableFlags,X      ; $EFDE  BD 30 01
  ora z:_var_00ce                ; $EFE1  05 CE
  sta a:_var_upperTableFlags,X      ; $EFE3  9D 30 01
  sta z:_var_00e8                ; $EFE6  85 E8
  txa                            ; $EFE8  8A
  bne _label_f013                ; $EFE9  D0 28
  lda z:_var_0000_indexed        ; $EFEB  A5 00
  ora #$04                       ; $EFED  09 04
  sta PPU_CTRL                   ; $EFEF  8D 00 20
  ldx #$22                       ; $EFF2  A2 22
  lda #$0B                       ; $EFF4  A9 0B
  jsr _func_e0ef                 ; $EFF6  20 EF E0
  ldx #$04                       ; $EFF9  A2 04

_label_effb:
  lda #$24                       ; $EFFB  A9 24
  asl z:_var_00e8                ; $EFFD  06 E8
  bcs _label_f003                ; $EFFF  B0 02
  lda #$8B                       ; $F001  A9 8B

_label_f003:
  sta PPU_DATA                   ; $F003  8D 07 20
  dex                            ; $F006  CA
  bne _label_effb                ; $F007  D0 F2
  lda #$00                       ; $F009  A9 00
  sta z:_var_00ce                ; $F00B  85 CE
  lda z:_var_0000_indexed        ; $F00D  A5 00
  sta PPU_CTRL                   ; $F00F  8D 00 20
  rts                            ; $F012  60

_label_f013:
  ldx #$00                       ; $F013  A2 00

_label_f015:
  asl z:_var_00e8                ; $F015  06 E8
  bcc _label_f021                ; $F017  90 08
  lda #$F0                       ; $F019  A9 F0
  sta a:_var_0290_indexed,X      ; $F01B  9D 90 02
  sta a:_var_02ac_indexed,X      ; $F01E  9D AC 02

; check if all flags hit ($F030)
; lower table opens exit
_label_f021:
  inx                            ; $F021  E8
  inx                            ; $F022  E8
  inx                            ; $F023  E8
  inx                            ; $F024  E8
  cpx #$1C                       ; $F025  E0 1C
  bne _label_f015                ; $F027  D0 EC
  lda z:_var_00ce                ; $F029  A5 CE
  beq _label_f03a                ; $F02B  F0 0D
  lda a:_var_lowerTableFlags                ; $F02D  AD 31 01
  cmp #$FE                       ; $F030  C9 FE
  bne _label_f03a                ; $F032  D0 06
  inc a:_var_012c                ; $F034  EE 2C 01
  inc a:_var_012b                ; $F037  EE 2B 01

_label_f03a:
  lda #$00                       ; $F03A  A9 00
  sta z:_var_00ce                ; $F03C  85 CE
  rts                            ; $F03E  60

_func_f03f:
  ldx z:_var_tableUpperOrLower                ; $F03F  A6 BF
  cpx #$02                       ; $F041  E0 02
  beq _label_f03a                ; $F043  F0 F5
  lda a:_data_e2c4_indexed,X     ; $F045  BD C4 E2
  sta z:_var_00db_indexed        ; $F048  85 DB
  lda a:_data_e2c6_indexed,X     ; $F04A  BD C6 E2
  sta z:_var_00dc                ; $F04D  85 DC
  lda a:_var_upperTableFlags,X      ; $F04F  BD 30 01
  sta z:_var_00e3                ; $F052  85 E3
  lda a:_data_e2c8_indexed,X     ; $F054  BD C8 E2
  tax                            ; $F057  AA
  ldy #$00                       ; $F058  A0 00

_label_f05a:
  lda #$24                       ; $F05A  A9 24
  asl z:_var_00e3                ; $F05C  06 E3
  bcs _label_f062                ; $F05E  B0 02
  lda #$8B                       ; $F060  A9 8B

_label_f062:
  sta (_var_00db_indexed),Y      ; $F062  91 DB
  tya                            ; $F064  98
  clc                            ; $F065  18
  adc #$20                       ; $F066  69 20
  tay                            ; $F068  A8
  dex                            ; $F069  CA
  bne _label_f05a                ; $F06A  D0 EE
  jmp _label_efdc                ; $F06C  4C DC EF

_func_f06f:
  lda z:_var_0005                ; $F06F  A5 05
  and #$03                       ; $F071  29 03
  beq _label_f076                ; $F073  F0 01
  rts                            ; $F075  60

_label_f076:
  lda a:_var_02fd                ; $F076  AD FD 02
  cmp #$CF                       ; $F079  C9 CF
  bne _label_f08d                ; $F07B  D0 10
  lda #$F0                       ; $F07D  A9 F0
  sta a:_var_02fc_indexed        ; $F07F  8D FC 02
  sta a:_var_02fd                ; $F082  8D FD 02
  lda a:_var_0154                ; $F085  AD 54 01
  sta a:_var_0155                ; $F088  8D 55 01
  bne _label_f0a0                ; $F08B  D0 13

_label_f08d:
  lda a:_var_02fc_indexed        ; $F08D  AD FC 02
  cmp #$F0                       ; $F090  C9 F0
  bne _label_f0a0                ; $F092  D0 0C
  ldx #$03                       ; $F094  A2 03

_label_f096:
  lda a:_data_c7bc_indexed,X     ; $F096  BD BC C7
  sta a:_var_02fc_indexed,X      ; $F099  9D FC 02
  dex                            ; $F09C  CA
  bpl _label_f096                ; $F09D  10 F7
  rts                            ; $F09F  60

_label_f0a0:
  lda z:_var_00cf                ; $F0A0  A5 CF
  bmi _label_f0a5                ; $F0A2  30 01
  rts                            ; $F0A4  60

_label_f0a5:
  and #$7F                       ; $F0A5  29 7F
  tay                            ; $F0A7  A8

_data_f0a8:
  lda #$02                       ; $F0A8  A9 02
  sta z:_var_00ff                ; $F0AA  85 FF
  iny                            ; $F0AC  C8
  cpy #$0A                       ; $F0AD  C0 0A
  bne _label_f0b2                ; $F0AF  D0 01
  dey                            ; $F0B1  88

_label_f0b2:
  sty z:_var_00cf                ; $F0B2  84 CF
  ldx #$03                       ; $F0B4  A2 03

_label_f0b6:
  lda a:_data_f0db_indexed,X     ; $F0B6  BD DB F0
  sta a:_var_02fc_indexed,X      ; $F0B9  9D FC 02
  dex                            ; $F0BC  CA
  bpl _label_f0b6                ; $F0BD  10 F7
  lda #$30                       ; $F0BF  A9 30
  sta a:_var_0155                ; $F0C1  8D 55 01

_func_f0c4:
  cpy #$09                       ; $F0C4  C0 09
  beq _label_f0d0                ; $F0C6  F0 08
  tya                            ; $F0C8  98
  clc                            ; $F0C9  18
  adc #$F1                       ; $F0CA  69 F1
  ldy #$F0                       ; $F0CC  A0 F0
  bne _label_f0d4                ; $F0CE  D0 04

_label_f0d0:
  lda #$FA                       ; $F0D0  A9 FA
  ldy #$FB                       ; $F0D2  A0 FB

_label_f0d4:
  sta a:_var_02c5                ; $F0D4  8D C5 02
  sty a:_var_02c9_indexed        ; $F0D7  8C C9 02
  rts                            ; $F0DA  60

_data_f0db_indexed:
.byte $4c, $cf, $00, $6c         ; $F0DB

; upper table left chute pills complete check?
_func_f0df:
  lda z:_var_upperTablePills                ; $F0DF  A5 D0
  bpl _label_f10f                ; $F0E1  10 2C
  lda #$04                       ; $F0E3  A9 04
  sta z:_var_00ff                ; $F0E5  85 FF

; left pills complete - 20x (0x14 @ $0132) 100 pts (seals bouncing balls)
_func_f0e7:
  lda z:_var_upperTablePills                ; $F0E7  A5 D0
  and #$7F                       ; $F0E9  29 7F
  sta z:_var_upperTablePills                ; $F0EB  85 D0
  bne _label_f0fd                ; $F0ED  D0 0E
  ldx #$14                       ; $F0EF  A2 14
  stx a:_var_upperTableSealBounces                ; $F0F1  8E 32 01
  ldy #$00                       ; $F0F4  A0 00
  sty z:_var_00cf                ; $F0F6  84 CF
  jsr _func_f0c4                 ; $F0F8  20 C4 F0
  lda #$00                       ; $F0FB  A9 00

_label_f0fd:
  cmp #$08                       ; $F0FD  C9 08
  beq _label_f10e                ; $F0FF  F0 0D
  asl a                          ; $F101  0A
  asl a                          ; $F102  0A
  tay                            ; $F103  A8
  lda #$F0                       ; $F104  A9 F0

_label_f106:
  sta a:_var_0264_indexed,Y      ; $F106  99 64 02
  iny                            ; $F109  C8
  cpy #$20                       ; $F10A  C0 20
  bne _label_f106                ; $F10C  D0 F8

_label_f10e:
  rts                            ; $F10E  60

; score upper table seals bouncing balls (100 x20) offset 0x0A
_label_f10f:
  lda a:_var_upperTableSealBounces                ; $F10F  AD 32 01
  beq _label_f10e                ; $F112  F0 FA
  lda z:_var_0005                ; $F114  A5 05
  and #$0F                       ; $F116  29 0F
  bne _label_f10e                ; $F118  D0 F4
  lda #$FF                       ; $F11A  A9 FF
  sta z:$CA                      ; $F11C  85 CA
  lda #$0A                       ; $F11E  A9 0A
  jsr _func_ee3d                 ; $F120  20 3D EE
  dec a:_var_upperTableSealBounces                ; $F123  CE 32 01
  bne _label_f10e                ; $F126  D0 E6
  lda #$08                       ; $F128  A9 08
  sta z:_var_upperTablePills                ; $F12A  85 D0
  ldx #$1F                       ; $F12C  A2 1F

_label_f12e:
  lda a:_data_c724_indexed,X     ; $F12E  BD 24 C7
  sta a:_var_0264_indexed,X      ; $F131  9D 64 02
  dex                            ; $F134  CA
  bpl _label_f12e                ; $F135  10 F7
  rts                            ; $F137  60

_func_f138:
  lda #$00                       ; $F138  A9 00
  sta z:_var_00e4                ; $F13A  85 E4
  ldx #$02                       ; $F13C  A2 02
  ldy #$00                       ; $F13E  A0 00

_label_f140:
  asl z:_var_00d4                ; $F140  06 D4
  bcc _label_f15c                ; $F142  90 18
  lda a:_var_012d_indexed,X      ; $F144  BD 2D 01
  bpl _label_f150                ; $F147  10 07
  lda #$00                       ; $F149  A9 00
  sta a:_var_012d_indexed,X      ; $F14B  9D 2D 01
  beq _label_f15c                ; $F14E  F0 0C  unconditional branch pattern (complementary branches)

_label_f150:
  bne _label_f157                ; $F150  D0 05  reachable from other code despite complementary branch
  inc a:_var_012d_indexed,X      ; $F152  FE 2D 01
  bne _label_f15c                ; $F155  D0 05

_label_f157:
  lda #$FF                       ; $F157  A9 FF
  sta a:_var_012d_indexed,X      ; $F159  9D 2D 01

_label_f15c:
  lda a:_var_012d_indexed,X      ; $F15C  BD 2D 01
  bpl _label_f16b                ; $F15F  10 0A
  lda #$B9                       ; $F161  A9 B9
  sta a:_var_0265_indexed,Y      ; $F163  99 65 02
  sta a:_var_0269_indexed,Y      ; $F166  99 69 02
  bne _label_f1c0                ; $F169  D0 55

_label_f16b:
  bne _label_f181                ; $F16B  D0 14
  lda #$AF                       ; $F16D  A9 AF
  sta a:_var_0265_indexed,Y      ; $F16F  99 65 02
  lda #$5C                       ; $F172  A9 5C
  sta a:_var_0269_indexed,Y      ; $F174  99 69 02
  lda #$00                       ; $F177  A9 00
  sta a:_var_0266_indexed,Y      ; $F179  99 66 02
  sta a:_var_026a_indexed,Y      ; $F17C  99 6A 02
  beq _label_f1c0                ; $F17F  F0 3F

_label_f181:
  cmp #$06                       ; $F181  C9 06
  beq _label_f1a1                ; $F183  F0 1C
  inc a:_var_012d_indexed,X      ; $F185  FE 2D 01
  lda #$9B                       ; $F188  A9 9B
  sta a:_var_0265_indexed,Y      ; $F18A  99 65 02
  lda #$5D                       ; $F18D  A9 5D
  sta a:_var_0269_indexed,Y      ; $F18F  99 69 02
  lda a:_var_012d_indexed,X      ; $F192  BD 2D 01
  cmp #$06                       ; $F195  C9 06
  bne _label_f1c0                ; $F197  D0 27
  lda #$04                       ; $F199  A9 04
  sta z:_var_00fe                ; $F19B  85 FE
  inc z:_var_00e4                ; $F19D  E6 E4
  bne _label_f1c0                ; $F19F  D0 1F

_label_f1a1:
  stx z:_var_00e3                ; $F1A1  86 E3
  ldx #$99                       ; $F1A3  A2 99
  lda z:_var_0005                ; $F1A5  A5 05
  and #$10                       ; $F1A7  29 10
  bne _label_f1ad                ; $F1A9  D0 02
  ldx #$86                       ; $F1AB  A2 86

_label_f1ad:
  txa                            ; $F1AD  8A
  sta a:_var_0265_indexed,Y      ; $F1AE  99 65 02
  inx                            ; $F1B1  E8
  txa                            ; $F1B2  8A
  sta a:_var_0269_indexed,Y      ; $F1B3  99 69 02
  lda #$02                       ; $F1B6  A9 02
  sta a:_var_0266_indexed,Y      ; $F1B8  99 66 02
  sta a:_var_026a_indexed,Y      ; $F1BB  99 6A 02
  ldx z:_var_00e3                ; $F1BE  A6 E3

_label_f1c0:
  tya                            ; $F1C0  98
  clc                            ; $F1C1  18
  adc #$08                       ; $F1C2  69 08
  tay                            ; $F1C4  A8
  dex                            ; $F1C5  CA
  bmi _label_f1cb                ; $F1C6  30 03
  jmp _label_f140                ; $F1C8  4C 40 F1

_label_f1cb:
  lda z:_var_00e4                ; $F1CB  A5 E4
  beq _label_f1e5                ; $F1CD  F0 16
  ldx #$02                       ; $F1CF  A2 02

_label_f1d1:
  lda a:_var_012d_indexed,X      ; $F1D1  BD 2D 01
  cmp #$06                       ; $F1D4  C9 06
  bne _label_f1e5                ; $F1D6  D0 0D
  dex                            ; $F1D8  CA
  bpl _label_f1d1                ; $F1D9  10 F6
  lda #$01                       ; $F1DB  A9 01
  sta z:_var_00ff                ; $F1DD  85 FF
  sta a:_var_0129                ; $F1DF  8D 29 01
  sta a:_var_012a                ; $F1E2  8D 2A 01

_label_f1e5:
  lda z:_var_00d6                ; $F1E5  A5 D6
  beq _label_f1f0                ; $F1E7  F0 07
  lda #$00                       ; $F1E9  A9 00
  sta a:_var_0129                ; $F1EB  8D 29 01
  sta z:_var_00d6                ; $F1EE  85 D6

_label_f1f0:
  lda z:_var_00d7                ; $F1F0  A5 D7
  beq _func_f1fb                 ; $F1F2  F0 07
  lda #$00                       ; $F1F4  A9 00
  sta a:_var_012a                ; $F1F6  8D 2A 01
  sta z:_var_00d7                ; $F1F9  85 D7

_func_f1fb:
  ldx a:_var_0129                ; $F1FB  AE 29 01
  lda a:_data_f220_indexed,X     ; $F1FE  BD 20 F2
  sta a:$06A9                    ; $F201  8D A9 06
  lda a:_data_f222_indexed,X     ; $F204  BD 22 F2
  sta a:$02E0                    ; $F207  8D E0 02
  sta a:$02E4                    ; $F20A  8D E4 02
  ldx a:_var_012a                ; $F20D  AE 2A 01
  lda a:_data_f224_indexed,X     ; $F210  BD 24 F2
  sta a:$06BA                    ; $F213  8D BA 06
  lda a:_data_f222_indexed,X     ; $F216  BD 22 F2
  sta a:$02E8                    ; $F219  8D E8 02
  sta a:$02EC                    ; $F21C  8D EC 02
  rts                            ; $F21F  60

_data_f220_indexed:
.byte $54, $a6                   ; $F220

_data_f222_indexed:
.byte $f0, $a5                   ; $F222

_data_f224_indexed:
.byte $58, $a6                   ; $F224

_func_f226:
  ldx #$02                       ; $F226  A2 02
  lda #$01                       ; $F228  A9 01
  sta z:_var_00dc                ; $F22A  85 DC

_label_f22c:
  ldy #$00                       ; $F22C  A0 00
  lda z:_var_00d8_indexed,X      ; $F22E  B5 D8
  sta z:_var_00e3                ; $F230  85 E3

_label_f232:
  lda a:_data_f2e7_indexed,X     ; $F232  BD E7 F2
  sta z:_var_00db_indexed        ; $F235  85 DB
  asl z:_var_00d8_indexed,X      ; $F237  16 D8
  bcc _label_f259                ; $F239  90 1E
  lda #$04                       ; $F23B  A9 04
  sta z:_var_00ff                ; $F23D  85 FF
  tya                            ; $F23F  98
  pha                            ; $F240  48
  txa                            ; $F241  8A
  pha                            ; $F242  48
  lda #$00                       ; $F243  A9 00
  jsr _func_ee3d                 ; $F245  20 3D EE
  pla                            ; $F248  68
  tax                            ; $F249  AA
  pla                            ; $F24A  68
  tay                            ; $F24B  A8
  lda (_var_00db_indexed),Y      ; $F24C  B1 DB
  clc                            ; $F24E  18
  adc #$01                       ; $F24F  69 01
  cmp #$03                       ; $F251  C9 03
  bne _label_f257                ; $F253  D0 02
  lda #$00                       ; $F255  A9 00

_label_f257:
  sta (_var_00db_indexed),Y      ; $F257  91 DB

_label_f259:
  iny                            ; $F259  C8
  cpy #$04                       ; $F25A  C0 04
  bne _label_f232                ; $F25C  D0 D4
  lda z:_var_00e3                ; $F25E  A5 E3
  beq _label_f271                ; $F260  F0 0F
  ldy #$03                       ; $F262  A0 03
  lda (_var_00db_indexed),Y      ; $F264  B1 DB
  dey                            ; $F266  88

_label_f267:
  cmp (_var_00db_indexed),Y      ; $F267  D1 DB
  bne _label_f271                ; $F269  D0 06
  dey                            ; $F26B  88
  bpl _label_f267                ; $F26C  10 F9
  inc a:_var_011f_indexed,X      ; $F26E  FE 1F 01

_label_f271:
  dex                            ; $F271  CA
  bpl _label_f22c                ; $F272  10 B8
  lda a:$013A                    ; $F274  AD 3A 01
  asl a                          ; $F277  0A
  asl a                          ; $F278  0A
  ora a:_var_0136                ; $F279  0D 36 01
  asl a                          ; $F27C  0A
  asl a                          ; $F27D  0A
  asl a                          ; $F27E  0A
  asl a                          ; $F27F  0A
  sta a:_var_0142                ; $F280  8D 42 01
  lda a:$013E                    ; $F283  AD 3E 01
  asl a                          ; $F286  0A
  asl a                          ; $F287  0A
  asl a                          ; $F288  0A
  asl a                          ; $F289  0A
  sta a:_var_0143                ; $F28A  8D 43 01
  lda a:$013C                    ; $F28D  AD 3C 01
  asl a                          ; $F290  0A
  asl a                          ; $F291  0A
  ora a:_var_0138                ; $F292  0D 38 01
  asl a                          ; $F295  0A
  asl a                          ; $F296  0A
  ora a:_var_013b                ; $F297  0D 3B 01
  asl a                          ; $F29A  0A
  asl a                          ; $F29B  0A
  ora a:_var_0137                ; $F29C  0D 37 01
  sta a:_var_0144                ; $F29F  8D 44 01
  lda a:$0140                    ; $F2A2  AD 40 01
  asl a                          ; $F2A5  0A
  asl a                          ; $F2A6  0A
  asl a                          ; $F2A7  0A
  asl a                          ; $F2A8  0A
  ora a:_var_013f                ; $F2A9  0D 3F 01
  ora #$44                       ; $F2AC  09 44
  sta a:_var_0145                ; $F2AE  8D 45 01
  lda a:$013D                    ; $F2B1  AD 3D 01
  asl a                          ; $F2B4  0A
  asl a                          ; $F2B5  0A
  ora a:_var_0139                ; $F2B6  0D 39 01
  sta a:_var_0146                ; $F2B9  8D 46 01
  lda a:$0141                    ; $F2BC  AD 41 01
  sta a:_var_0147                ; $F2BF  8D 47 01
  ldx #$02                       ; $F2C2  A2 02

_label_f2c4:
  lda a:_var_011f_indexed,X      ; $F2C4  BD 1F 01
  beq _label_f2e3                ; $F2C7  F0 1A
  ldy a:_data_f2ea_indexed,X     ; $F2C9  BC EA F2
  clc                            ; $F2CC  18
  adc #$36                       ; $F2CD  69 36
  cmp #$39                       ; $F2CF  C9 39
  bcc _label_f2d5                ; $F2D1  90 02
  lda #$B9                       ; $F2D3  A9 B9

_label_f2d5:
  sta a:_var_0265_indexed,Y      ; $F2D5  99 65 02
  lda a:_data_f2ed_indexed,X     ; $F2D8  BD ED F2
  sta a:_var_0267_indexed,Y      ; $F2DB  99 67 02
  lda #$F0                       ; $F2DE  A9 F0
  sta a:_var_0268_indexed,Y      ; $F2E0  99 68 02

_label_f2e3:
  dex                            ; $F2E3  CA
  bpl _label_f2c4                ; $F2E4  10 DE
  rts                            ; $F2E6  60

_data_f2e7_indexed:
.byte $36, $3a, $3e              ; $F2E7

_data_f2ea_indexed:
.byte $00, $08, $10              ; $F2EA

_data_f2ed_indexed:
.byte $84, $94, $a4              ; $F2ED

_func_f2f0:
  ldx #$23                       ; $F2F0  A2 23
  lda #$D4                       ; $F2F2  A9 D4
  ldy a:_var_0142                ; $F2F4  AC 42 01
  jsr _func_e0f6                 ; $F2F7  20 F6 E0
  lda a:_var_0143                ; $F2FA  AD 43 01
  sta PPU_DATA                   ; $F2FD  8D 07 20
  ldx #$23                       ; $F300  A2 23
  lda #$DC                       ; $F302  A9 DC
  ldy a:_var_0144                ; $F304  AC 44 01
  jsr _func_e0f6                 ; $F307  20 F6 E0
  lda a:_var_0145                ; $F30A  AD 45 01
  sta PPU_DATA                   ; $F30D  8D 07 20
  ldx #$23                       ; $F310  A2 23
  lda #$E4                       ; $F312  A9 E4
  ldy a:_var_0146                ; $F314  AC 46 01
  jsr _func_e0f6                 ; $F317  20 F6 E0
  lda a:_var_0147                ; $F31A  AD 47 01
  sta PPU_DATA                   ; $F31D  8D 07 20

_label_f320:
  rts                            ; $F320  60

_func_f321:
  ldx z:_var_tableUpperOrLower                ; $F321  A6 BF
  ldy a:_data_f3b1_indexed,X     ; $F323  BC B1 F3
  lda z:_var_00f0                ; $F326  A5 F0
  beq _label_f320                ; $F328  F0 F6
  bmi _label_f36d                ; $F32A  30 41
  lda a:_data_f3b7_indexed,X     ; $F32C  BD B7 F3
  sta a:_var_0154                ; $F32F  8D 54 01
  sta a:_var_0155                ; $F332  8D 55 01
  lda #$23                       ; $F335  A9 23
  sta PPU_ADDR                   ; $F337  8D 06 20
  lda a:_data_f3b3_indexed,X     ; $F33A  BD B3 F3
  sta PPU_ADDR                   ; $F33D  8D 06 20
  lda #$6A                       ; $F340  A9 6A
  sta PPU_DATA                   ; $F342  8D 07 20
  sta a:_var_0731_indexed,Y      ; $F345  99 31 07
  lda #$6B                       ; $F348  A9 6B
  sta PPU_DATA                   ; $F34A  8D 07 20
  sta a:_var_0732_indexed,Y      ; $F34D  99 32 07
  lda #$23                       ; $F350  A9 23
  sta PPU_ADDR                   ; $F352  8D 06 20
  lda a:_data_f3b5_indexed,X     ; $F355  BD B5 F3
  sta PPU_ADDR                   ; $F358  8D 06 20
  lda #$70                       ; $F35B  A9 70
  sta PPU_DATA                   ; $F35D  8D 07 20
  sta a:_var_0751_indexed,Y      ; $F360  99 51 07
  lda #$71                       ; $F363  A9 71
  sta PPU_DATA                   ; $F365  8D 07 20
  sta a:_var_0752_indexed,Y      ; $F368  99 52 07
  bne _label_f3ac                ; $F36B  D0 3F

_label_f36d:
  lda #$12                       ; $F36D  A9 12
  sta a:_var_0154                ; $F36F  8D 54 01
  sta a:_var_0155                ; $F372  8D 55 01
  lda #$00                       ; $F375  A9 00
  sta a:_var_014b                ; $F377  8D 4B 01
  lda #$23                       ; $F37A  A9 23
  sta PPU_ADDR                   ; $F37C  8D 06 20
  lda a:_data_f3b3_indexed,X     ; $F37F  BD B3 F3
  sta PPU_ADDR                   ; $F382  8D 06 20
  lda #$24                       ; $F385  A9 24
  sta PPU_DATA                   ; $F387  8D 07 20
  sta a:_var_0731_indexed,Y      ; $F38A  99 31 07
  sta PPU_DATA                   ; $F38D  8D 07 20
  sta a:_var_0732_indexed,Y      ; $F390  99 32 07
  lda #$23                       ; $F393  A9 23
  sta PPU_ADDR                   ; $F395  8D 06 20
  lda a:_data_f3b5_indexed,X     ; $F398  BD B5 F3
  sta PPU_ADDR                   ; $F39B  8D 06 20
  lda #$24                       ; $F39E  A9 24
  sta PPU_DATA                   ; $F3A0  8D 07 20
  sta a:_var_0751_indexed,Y      ; $F3A3  99 51 07
  sta PPU_DATA                   ; $F3A6  8D 07 20
  sta a:_var_0752_indexed,Y      ; $F3A9  99 52 07

_label_f3ac:
  lda #$00                       ; $F3AC  A9 00
  sta z:_var_00f0                ; $F3AE  85 F0

_label_f3b0:
  rts                            ; $F3B0  60

_data_f3b1_indexed:
.byte $20, $00                   ; $F3B1

_data_f3b3_indexed:
.byte $51, $31                   ; $F3B3

_data_f3b5_indexed:
.byte $71, $51                   ; $F3B5

_data_f3b7_indexed:
.byte $15, $27                   ; $F3B7

_func_f3b9:
  ldy a:_var_012c                ; $F3B9  AC 2C 01
  beq _label_f3b0                ; $F3BC  F0 F2
  ldx #$21                       ; $F3BE  A2 21
  lda #$17                       ; $F3C0  A9 17
  jsr _func_e0ef                 ; $F3C2  20 EF E0
  tya                            ; $F3C5  98
  bmi _label_f3d7                ; $F3C6  30 0F
  ldx #$B7                       ; $F3C8  A2 B7
  stx PPU_DATA                   ; $F3CA  8E 07 20
  inx                            ; $F3CD  E8
  stx PPU_DATA                   ; $F3CE  8E 07 20
  inx                            ; $F3D1  E8
  stx PPU_DATA                   ; $F3D2  8E 07 20
  bne _label_f3e2                ; $F3D5  D0 0B

_label_f3d7:
  lda #$24                       ; $F3D7  A9 24
  sta PPU_DATA                   ; $F3D9  8D 07 20
  sta PPU_DATA                   ; $F3DC  8D 07 20
  sta PPU_DATA                   ; $F3DF  8D 07 20

_label_f3e2:
  lda #$00                       ; $F3E2  A9 00
  sta a:_var_012c                ; $F3E4  8D 2C 01
  rts                            ; $F3E7  60

_func_f3e8:
  ldx a:_var_012b                ; $F3E8  AE 2B 01
  ldy #$10                       ; $F3EB  A0 10

_label_f3ed:
  lda a:_data_f416_indexed,X     ; $F3ED  BD 16 F4
  sta a:_var_02c9_indexed,Y      ; $F3F0  99 C9 02
  lda a:_data_f418_indexed,X     ; $F3F3  BD 18 F4
  sta a:_var_02cd_indexed,Y      ; $F3F6  99 CD 02
  tya                            ; $F3F9  98
  sec                            ; $F3FA  38
  sbc #$08                       ; $F3FB  E9 08
  tay                            ; $F3FD  A8
  bpl _label_f3ed                ; $F3FE  10 ED
  ldy #$40                       ; $F400  A0 40

_label_f402:
  lda a:_data_f41a_indexed,X     ; $F402  BD 1A F4
  sta a:_var_04fa_indexed,Y      ; $F405  99 FA 04
  lda a:_data_f41c_indexed,X     ; $F408  BD 1C F4
  sta a:_var_04fb_indexed,Y      ; $F40B  99 FB 04
  tya                            ; $F40E  98
  sec                            ; $F40F  38
  sbc #$20                       ; $F410  E9 20
  tay                            ; $F412  A8
  bpl _label_f402                ; $F413  10 ED

_label_f415:
  rts                            ; $F415  60

_data_f416_indexed:
.byte $5a, $b9                   ; $F416

_data_f418_indexed:
.byte $5b, $b9                   ; $F418

_data_f41a_indexed:
.byte $5b, $24                   ; $F41A

_data_f41c_indexed:
.byte $6d, $24                   ; $F41C

_func_f41e:
  lda z:_var_00d5                ; $F41E  A5 D5
  beq _label_f415                ; $F420  F0 F3
  lda #$08                       ; $F422  A9 08
  sta z:_var_00ff                ; $F424  85 FF
  lda #$00                       ; $F426  A9 00
  sta z:_var_00d5                ; $F428  85 D5
  lda a:_var_lowerTableFlags                ; $F42A  AD 31 01
  cmp #$FE                       ; $F42D  C9 FE
  bne _label_f415                ; $F42F  D0 E4
  lda #$00                       ; $F431  A9 00
  sta a:_var_lowerTableFlags                ; $F433  8D 31 01
  sta a:_var_012b                ; $F436  8D 2B 01
  dec a:_var_012c                ; $F439  CE 2C 01
  jsr _func_f03f                 ; $F43C  20 3F F0
  ldx #$37                       ; $F43F  A2 37

_label_f441:
  lda a:_data_c9d1_indexed,X     ; $F441  BD D1 C9
  sta a:_var_0290_indexed,X      ; $F444  9D 90 02
  dex                            ; $F447  CA
  bpl _label_f441                ; $F448  10 F7

_label_f44a:
  rts                            ; $F44A  60

_func_f44b:
  lda #$B9                       ; $F44B  A9 B9
  sta a:_var_02cd_indexed        ; $F44D  8D CD 02
  sta a:_var_02dd                ; $F450  8D DD 02
  lda a:_var_upperTableSealBounces                ; $F453  AD 32 01
  beq _label_f44a                ; $F456  F0 F2
  ldx #$00                       ; $F458  A2 00
  lda z:_var_0005                ; $F45A  A5 05
  and #$10                       ; $F45C  29 10
  beq _label_f461                ; $F45E  F0 01
  inx                            ; $F460  E8

_label_f461:
  ldy a:_data_f4ac_indexed,X     ; $F461  BC AC F4
  sty a:$02D1                    ; $F464  8C D1 02
  sty a:$02E1                    ; $F467  8C E1 02
  iny                            ; $F46A  C8
  sty a:$02D5                    ; $F46B  8C D5 02
  sty a:$02E5                    ; $F46E  8C E5 02
  iny                            ; $F471  C8
  sty a:$02D9                    ; $F472  8C D9 02
  sty a:$02E9                    ; $F475  8C E9 02
  lda a:_data_f4ae_indexed,X     ; $F478  BD AE F4
  sta a:_var_02cd_indexed        ; $F47B  8D CD 02
  sta a:_var_02dd                ; $F47E  8D DD 02
  lda a:_data_f4b0_indexed,X     ; $F481  BD B0 F4
  sta a:$02D3                    ; $F484  8D D3 02
  lda a:_data_f4b2_indexed,X     ; $F487  BD B2 F4
  sta a:$02E3                    ; $F48A  8D E3 02
  lda a:_var_02cc                ; $F48D  AD CC 02
  clc                            ; $F490  18
  adc a:_var_0149                ; $F491  6D 49 01
  sta a:_var_02cc                ; $F494  8D CC 02
  sta a:$02DC                    ; $F497  8D DC 02
  cmp #$5F                       ; $F49A  C9 5F
  bne _label_f4a2                ; $F49C  D0 04
  lda #$01                       ; $F49E  A9 01
  bne _label_f4a8                ; $F4A0  D0 06

_label_f4a2:
  cmp #$67                       ; $F4A2  C9 67
  bne _label_f4ab                ; $F4A4  D0 05
  lda #$FF                       ; $F4A6  A9 FF

_label_f4a8:
  sta a:_var_0149                ; $F4A8  8D 49 01

_label_f4ab:
  rts                            ; $F4AB  60

_data_f4ac_indexed:
.byte $7d, $88                   ; $F4AC

_data_f4ae_indexed:
.byte $f0, $fb                   ; $F4AE

_data_f4b0_indexed:
.byte $74, $76                   ; $F4B0

_data_f4b2_indexed:
.byte $a4, $a2, $03, $03, $03, $03, $03, $03, $03, $03, $c0, $c0, $c0, $c0, $c0, $c0 ; $F4B2
.byte $c0, $c0, $80, $c0, $60, $30, $18, $0c, $06, $03, $e0, $c0, $80, $00, $00, $00 ; $F4C2
.byte $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $3c, $78, $e0, $c0, $80, $00 ; $F4D2
.byte $00, $00, $00, $00, $00, $c0, $e0, $60, $00, $00, $00, $00, $00, $00, $00, $c0 ; $F4E2
.byte $e0, $70, $00, $00, $01, $01, $01, $01, $01, $01, $00, $80, $c0, $c0, $c0, $c0 ; $F4F2
.byte $c0, $c0, $ff, $ff, $ff, $ff, $ff, $ff, $ff, $ff, $01, $01, $01, $01, $01, $01 ; $F502
.byte $01, $01, $80, $c0, $e0, $f0, $f8, $fc, $fe, $ff, $01, $03, $07, $0f, $1f, $3f ; $F512
.byte $7f, $ff, $80, $80, $80, $80, $80, $80, $80, $80, $fe, $fe, $fe, $fe, $fe, $fe ; $F522
.byte $fe, $fc, $0f, $0f, $0f, $0f, $0f, $0f, $0f, $0f, $ff, $ff, $ff, $ff, $ff, $ff ; $F532
.byte $ff, $ff, $ff, $ff, $ff, $ff, $ff, $ff, $ff, $fc, $ff, $ff, $ff, $fc, $f0, $c0 ; $F542
.byte $00, $00, $ff, $e0, $00, $00, $00, $00, $00, $00, $ff, $00, $00, $00, $00, $00 ; $F552
.byte $00, $00, $ff, $0f, $01, $00, $00, $00, $00, $00, $ff, $ff, $ff, $3f, $0f, $03 ; $F562
.byte $00, $00, $ff, $ff, $ff, $ff, $ff, $ff, $ff, $3f, $ff, $ff, $ff, $ff, $ff, $fe ; $F572
.byte $fc, $f8, $f8, $e0, $c0, $80, $00, $00, $00, $00, $1f, $07, $03, $01, $00, $00 ; $F582
.byte $00, $00, $ff, $ff, $ff, $ff, $ff, $7f, $3f, $1f, $ff, $ff, $ff, $ff, $ff, $ff ; $F592
.byte $ff, $ff, $f0, $f0, $e0, $c0, $c0, $80, $00, $00, $00, $00, $00, $03, $0f, $3f ; $F5A2
.byte $7f, $ff, $00, $00, $e0, $f0, $f8, $fc, $fe, $ff, $00, $0f, $07, $03, $01, $00 ; $F5B2
.byte $00, $00, $00, $f8, $f0, $e0, $c0, $80, $00, $00, $01, $03, $07, $0f, $1f, $3f ; $F5C2
.byte $7f, $ff, $ff, $ff, $ff, $ff, $ff, $ff, $ff, $ff, $e0, $fc, $ff, $ff, $ff, $ff ; $F5D2
.byte $ff, $ff, $00, $00, $00, $c0, $f0, $fc, $fe, $ff, $0f, $0f, $07, $03, $03, $01 ; $F5E2
.byte $00, $00, $ff, $ff, $ff, $ff, $ff, $ff, $ff, $ff, $f0, $f0, $f0, $f0, $f0, $f0 ; $F5F2
.byte $f0, $f0, $fe, $fe, $fc, $fc, $f8, $f8, $f0, $f0, $01, $01, $03, $07, $07, $0f ; $F602
.byte $0f, $1f, $ff, $ff, $ff, $ff, $ff, $ff, $ff, $ff, $ff, $ff, $ff, $ff, $ff, $ff ; $F612
.byte $ff, $ff, $80, $c0, $e0, $f0, $f8, $fc, $fe, $ff, $00, $00, $00, $00, $18, $3c ; $F622
.byte $7e, $ff, $80, $80, $c0, $e0, $e0, $f0, $f8, $f8, $7f, $7f, $3f, $3f, $1f, $1f ; $F632
.byte $0f, $0f, $f0, $e0, $e0, $e0, $c0, $c0, $c0, $c0, $1f, $3f, $3f, $7f, $7f, $7f ; $F642
.byte $ff, $ff, $80, $80, $80, $80, $80, $80, $80, $80, $ff, $ff, $ff, $ff, $ff, $ff ; $F652
.byte $ff, $ff, $00, $00, $00, $07, $1f, $3f, $7f, $7f, $00, $00, $00, $e0, $f8, $fc ; $F662
.byte $fe, $fe, $01, $01, $01, $01, $01, $01, $01, $01, $fc, $fc, $fe, $fe, $fe, $ff ; $F672
.byte $ff, $ff, $07, $07, $07, $03, $03, $03, $03, $01, $ff, $ff, $ff, $ff, $ff, $ff ; $F682
.byte $ff, $ff, $ff, $f6, $e5, $f5, $f5, $f5, $f6, $ff, $ff, $ef, $57, $57, $57, $57 ; $F692
.byte $ef, $ff, $ff, $ff, $ff, $ff, $e0, $e0, $e0, $e0, $ff, $ff, $ff, $ff, $03, $03 ; $F6A2
.byte $03, $03, $ff, $ff, $ff, $ff, $ff, $ff, $ff, $ff, $ff, $ff, $ff, $fc, $f0, $e0 ; $F6B2
.byte $c0, $80, $e0, $e0, $e0, $e0, $e0, $e0, $e0, $e0, $00, $03, $03, $03, $03, $03 ; $F6C2
.byte $03, $03, $ff, $ff, $ff, $3f, $0f, $07, $03, $01, $ff, $ff, $ff, $ff, $ff, $ff ; $F6D2
.byte $ff, $ff, $80, $80, $80, $c0, $c0, $c0, $c0, $e0, $01, $01, $01, $01, $01, $00 ; $F6E2
.byte $00, $00, $ff, $ff, $ff, $ff, $ff, $ff, $ff, $ff, $ff, $fe, $fc, $f8, $f0, $e0 ; $F6F2
.byte $c0, $80, $00, $00, $07, $0f, $1f, $1f, $3f, $3f, $00, $00, $e0, $f0, $f8, $f8 ; $F702
.byte $fc, $fc, $ff, $ff, $7f, $7f, $3f, $3f, $1f, $1f, $e0, $e0, $e0, $e0, $e0, $e0 ; $F712
.byte $e0, $e0, $80, $80, $80, $c0, $c0, $c0, $e0, $e0, $ff, $ff, $ff, $7f, $7f, $7f ; $F722
.byte $3f, $3f, $3f, $3f, $1f, $1f, $0f, $07, $00, $00, $fc, $fc, $f8, $f8, $f0, $e0 ; $F732
.byte $00, $00, $00, $00, $00, $00, $03, $03, $03, $03, $00, $00, $00, $00, $c0, $c0 ; $F742
.byte $c0, $c0, $0f, $0f, $0f, $0f, $07, $07, $07, $07, $e0, $e0, $e0, $e0, $e0, $e0 ; $F752
.byte $e0, $e0, $e0, $f0, $f0, $f0, $f8, $f8, $f8, $fc, $3f, $1f, $1f, $1f, $0f, $0f ; $F762
.byte $0f, $07, $ff, $ff, $ff, $ff, $ff, $ff, $ff, $ff, $ff, $7f, $3f, $1f, $0f, $07 ; $F772
.byte $03, $01, $01, $03, $07, $0f, $1f, $3f, $7f, $ff, $07, $07, $07, $07, $07, $07 ; $F782
.byte $07, $07, $fc, $fc, $fe, $fe, $fe, $ff, $ff, $ff, $07, $03, $03, $01, $01, $00 ; $F792
.byte $00, $00, $ff, $ff, $ff, $ff, $ff, $fe, $fe, $7c, $00, $00, $00, $00, $01, $01 ; $F7A2
.byte $03, $03, $0f, $3f, $7f, $ff, $ff, $ff, $ff, $ff, $f0, $fc, $fe, $ff, $ff, $ff ; $F7B2
.byte $ff, $ff, $00, $00, $00, $00, $80, $80, $c0, $c0, $03, $07, $07, $07, $07, $07 ; $F7C2
.byte $07, $03, $ff, $f6, $e5, $f5, $f5, $f5, $f6, $ff, $ff, $ef, $57, $57, $57, $57 ; $F7D2
.byte $ef, $ff, $c0, $e0, $e0, $e0, $e0, $e0, $e0, $c0, $03, $03, $01, $01, $00, $00 ; $F7E2
.byte $00, $00, $ff, $ff, $ff, $ff, $ff, $7f, $3f, $0f, $ff, $ff, $ff, $ff, $ff, $fe ; $F7F2
.byte $fc, $f0, $c0, $c0, $80, $80, $00, $00, $00, $00, $60, $60, $60, $60, $60, $60 ; $F802
.byte $60, $00, $07, $07, $07, $0f, $0f, $0f, $1f, $1f, $00, $00, $00, $00, $00, $01 ; $F812
.byte $03, $07, $1f, $3f, $3f, $7f, $ff, $ff, $ff, $ff, $0f, $3f, $ff, $ff, $ff, $ff ; $F822
.byte $ff, $ff, $00, $00, $00, $03, $07, $06, $00, $00, $ff, $ff, $ff, $ff, $ff, $ff ; $F832
.byte $ff, $ff, $ff, $7f, $3f, $1f, $0f, $07, $03, $03, $18, $18, $1c, $1e, $1b, $19 ; $F842
.byte $18, $18, $d8, $d8, $c0, $da, $db, $db, $db, $db, $00, $0c, $1e, $cc, $6d, $6d ; $F852
.byte $6d, $6c, $00, $00, $00, $e5, $b6, $f6, $86, $e6, $03, $03, $03, $8f, $db, $db ; $F862
.byte $db, $cf, $00, $00, $00, $38, $6c, $6c, $6c, $38, $01, $01, $01, $01, $01, $01 ; $F872
.byte $01, $03, $01, $03, $07, $07, $07, $07, $07, $07, $ff, $ff, $ff, $ff, $ff, $ff ; $F882
.byte $ff, $ff, $80, $c0, $e0, $f8, $ff, $ff, $ff, $ff, $03, $07, $0f, $3f, $ff, $ff ; $F892
.byte $ff, $ff, $01, $01, $01, $01, $01, $00, $00, $00, $c0, $c0, $c0, $c0, $c0, $80 ; $F8A2
.byte $00, $00, $07, $07, $07, $07, $07, $07, $07, $07, $ff, $ff, $fe, $fe, $fc, $fc ; $F8B2
.byte $f8, $f8, $7f, $7f, $3f, $1f, $07, $00, $00, $00, $fe, $fe, $fc, $f8, $e0, $00 ; $F8C2
.byte $00, $00, $0f, $0f, $07, $07, $03, $03, $01, $01, $ff, $ff, $ff, $ff, $ff, $ff ; $F8D2
.byte $ff, $ff, $00, $00, $00, $ff, $ff, $00, $00, $00, $00, $00, $00, $7f, $7f, $00 ; $F8E2
.byte $00, $00, $00, $00, $00, $3f, $3f, $00, $00, $00, $00, $00, $00, $1f, $1f, $00 ; $F8F2
.byte $00, $00, $00, $00, $00, $0f, $0f, $00, $00, $00, $00, $00, $00, $07, $07, $00 ; $F902
.byte $00, $00, $00, $00, $00, $03, $03, $00, $00, $00, $00, $00, $00, $01, $01, $00 ; $F912
.byte $00, $00, $0f, $07, $03, $03, $01, $01, $01, $01, $01, $01, $01, $03, $03, $07 ; $F922
.byte $07, $0f, $7f, $7f, $7f, $7f, $7f, $7f, $7f, $3f, $fe, $da, $aa, $aa, $aa, $da ; $F932
.byte $fe, $fc, $fe, $e6, $ea, $ee, $ee, $c6, $fe, $fc, $fe, $c6, $ea, $da, $da, $e6 ; $F942
.byte $fe, $fc, $fe, $da, $ea, $f2, $ea, $da, $fe, $fc, $fe, $da, $c2, $da, $da, $e6 ; $F952
.byte $fe, $fc, $0f, $1f, $1f, $3f, $3f, $7f, $7f, $ff, $ff, $ff, $c5, $dd, $c6, $dd ; $F962
.byte $c5, $ff, $00, $ff, $51, $5b, $db, $5b, $5b, $ff, $00, $00, $80, $c0, $e0, $c0 ; $F972
.byte $80, $00, $03, $03, $03, $03, $03, $03, $03, $03, $02, $07, $07, $07, $07, $07 ; $F982
.byte $07, $07, $00, $00, $00, $01, $01, $01, $03, $03, $c0, $c0, $c0, $c0, $c0, $c0 ; $F992
.byte $c0, $c0, $00, $00, $00, $80, $80, $80, $c0, $c0, $07, $07, $07, $07, $07, $07 ; $F9A2
.byte $07, $07, $03, $07, $07, $07, $0f, $0f, $0f, $1f, $40, $e0, $e0, $e0, $e0, $e0 ; $F9B2
.byte $e0, $e0, $c0, $e0, $e0, $e0, $f0, $f0, $f0, $f8, $07, $07, $07, $07, $07, $03 ; $F9C2
.byte $03, $01, $e0, $e0, $e0, $e0, $e0, $e0, $e0, $e0, $1f, $1f, $3f, $3f, $3f, $7f ; $F9D2
.byte $7f, $7f, $ff, $ff, $ff, $ff, $e6, $e3, $e0, $e0, $ff, $ff, $ff, $ff, $03, $83 ; $F9E2
.byte $c3, $73, $03, $03, $03, $03, $03, $01, $01, $00, $f8, $f8, $fc, $fc, $fc, $fe ; $F9F2
.byte $fe, $fe, $ff, $7f, $1f, $0e, $00, $00, $00, $00, $e0, $e0, $e0, $e0, $e0, $c0 ; $FA02
.byte $c0, $80, $ff, $fe, $f8, $70, $00, $00, $00, $00, $c0, $c0, $c0, $c0, $c0, $80 ; $FA12
.byte $80, $00, $e0, $e0, $e3, $ee, $e6, $e3, $e0, $e0, $38, $e3, $83, $03, $03, $83 ; $FA22
.byte $c3, $73, $00, $00, $00, $00, $80, $80, $c0, $c0, $e0, $70, $3c, $1e, $07, $03 ; $FA32
.byte $01, $00, $07, $0e, $3c, $78, $e0, $c0, $80, $00, $00, $00, $00, $00, $01, $01 ; $FA42
.byte $03, $03, $3c, $1e, $07, $03, $01, $00, $00, $00, $00, $00, $00, $00, $00, $03 ; $FA52
.byte $07, $0e, $3f, $7f, $ff, $ff, $ff, $ff, $ff, $ff, $7f, $3f, $00, $00, $00, $00 ; $FA62
.byte $00, $00, $ff, $ff, $ff, $ff, $ff, $ff, $ff, $ff, $ff, $ff, $00, $00, $00, $00 ; $FA72
.byte $00, $00, $ff, $bf, $bf, $ff, $ff, $bf, $bf, $ff, $00, $00, $00, $00, $00, $ff ; $FA82
.byte $ff, $ff, $f0, $f0, $e0, $e0, $c0, $c0, $80, $80, $00, $00, $00, $80, $80, $00 ; $FA92
.byte $00, $00, $00, $00, $00, $c0, $c0, $00, $00, $00, $00, $00, $00, $e0, $e0, $00 ; $FAA2
.byte $00, $00, $00, $00, $00, $f0, $f0, $00, $00, $00, $00, $00, $00, $f8, $f8, $00 ; $FAB2
.byte $00, $00, $00, $00, $00, $fc, $fc, $00, $00, $00, $00, $00, $00, $fe, $fe, $00 ; $FAC2
.byte $00, $00, $00, $00, $00, $ff, $ff, $00, $00, $00, $80, $80, $c0, $c0, $e0, $e0 ; $FAD2
.byte $f0, $f0, $3e, $7f, $ff, $ff, $ff, $ff, $ff, $ff, $7f, $3f, $0f, $01, $00, $00 ; $FAE2
.byte $00, $00, $01, $01, $03, $03, $07, $07, $0f, $0f, $f8, $f8, $fc, $fc, $fe, $fe ; $FAF2
.byte $ff, $ff, $f8, $f8, $fc, $fc, $fe, $fe, $ff, $ff, $1f, $1f, $3f, $3f, $7f, $7f ; $FB02
.byte $ff, $ff, $1f, $1f, $3f, $3f, $7f, $7f, $ff, $ff, $ff, $ff, $ff, $ff, $e7, $c3 ; $FB12
.byte $81, $ff, $ff, $ff, $ff, $ff, $ff, $ff, $ff, $ff ; $FB22

_label_fb2c:
  lda #$C0                       ; $FB2C  A9 C0
  sta APU_FRAME                  ; $FB2E  8D 17 40
  jsr _func_fbdd                 ; $FB31  20 DD FB
  lda #$00                       ; $FB34  A9 00
  sta z:_var_00ff                ; $FB36  85 FF
  sta z:_var_00fe                ; $FB38  85 FE
  sta z:_var_00fd                ; $FB3A  85 FD
  sta APU_DMC_RAW                ; $FB3C  8D 11 40
  rts                            ; $FB3F  60

_func_fb40:
  jsr _func_ffdc                 ; $FB40  20 DC FF

_func_fb43:
  ldx #$00                       ; $FB43  A2 00
.byte $2c                        ; $FB45  2C  branch into instruction detected: bit a:$04A2

_func_fb46:
.byte $a2, $04                   ; $FB46  A2 04
.byte $2c                        ; $FB48  2C  branch into instruction detected: bit a:$08A2

_label_fb49:
.byte $a2, $08                   ; $FB49  A2 08
  tay                            ; $FB4B  A8
  lda a:_data_ff01_indexed,Y     ; $FB4C  B9 01 FF
  beq _label_fb5c                ; $FB4F  F0 0B
  sta APU_PL1_LO,X               ; $FB51  9D 02 40
  lda a:_data_ff00_indexed,Y     ; $FB54  B9 00 FF
  ora #$08                       ; $FB57  09 08
  sta APU_PL1_HI,X               ; $FB59  9D 03 40

_label_fb5c:
  rts                            ; $FB5C  60

_func_fb5d:
  tax                            ; $FB5D  AA
  ror a                          ; $FB5E  6A
  txa                            ; $FB5F  8A
  rol a                          ; $FB60  2A
  rol a                          ; $FB61  2A
  rol a                          ; $FB62  2A
  and #$07                       ; $FB63  29 07
  clc                            ; $FB65  18
  adc a:_var_07f0                ; $FB66  6D F0 07
  tay                            ; $FB69  A8
  lda a:_data_ff28_indexed,Y     ; $FB6A  B9 28 FF
  rts                            ; $FB6D  60

_label_fb6e:
  sty z:_var_00f1_indexed        ; $FB6E  84 F1
  lda #$28                       ; $FB70  A9 28
  sta z:_var_00f7                ; $FB72  85 F7
  lda #$1A                       ; $FB74  A9 1A
  sta z:_var_00f8                ; $FB76  85 F8
  ldx #$9C                       ; $FB78  A2 9C
  ldy #$83                       ; $FB7A  A0 83
  jsr _func_ffdc                 ; $FB7C  20 DC FF

_label_fb7f:
  lda z:_var_00f7                ; $FB7F  A5 F7
  cmp #$20                       ; $FB81  C9 20
  bcs _label_fb8c                ; $FB83  B0 07
  lsr a                          ; $FB85  4A
  lsr a                          ; $FB86  4A
  ora #$90                       ; $FB87  09 90
  sta APU_PL1_VOL                ; $FB89  8D 00 40

_label_fb8c:
  lda z:_var_00f7                ; $FB8C  A5 F7
  and #$03                       ; $FB8E  29 03
  bne _label_fbaa                ; $FB90  D0 18
  lda z:_var_00f8                ; $FB92  A5 F8
  lsr a                          ; $FB94  4A
  lsr a                          ; $FB95  4A
  lsr a                          ; $FB96  4A
  lsr a                          ; $FB97  4A
  sec                            ; $FB98  38
  adc z:_var_00f8                ; $FB99  65 F8
  sta z:_var_00f8                ; $FB9B  85 F8
  rol a                          ; $FB9D  2A
  rol a                          ; $FB9E  2A
  sta APU_PL1_LO                 ; $FB9F  8D 02 40
  rol a                          ; $FBA2  2A
  and #$07                       ; $FBA3  29 07
  ora #$08                       ; $FBA5  09 08
  sta APU_PL1_HI                 ; $FBA7  8D 03 40

_label_fbaa:
  bne _label_fc27                ; $FBAA  D0 7B

_label_fbac:
  sty z:_var_00f1_indexed        ; $FBAC  84 F1
  lda #$34                       ; $FBAE  A9 34
  sta z:_var_00f7                ; $FBB0  85 F7
  ldx #$5C                       ; $FBB2  A2 5C
  ldy #$81                       ; $FBB4  A0 81
  jsr _func_ffdc                 ; $FBB6  20 DC FF
  bne _label_fbce                ; $FBB9  D0 13

_label_fbbb:
  lda z:_var_00f7                ; $FBBB  A5 F7
  lsr a                          ; $FBBD  4A
  cmp #$50                       ; $FBBE  C9 50
  bcc _label_fbc3                ; $FBC0  90 01
  lsr a                          ; $FBC2  4A

_label_fbc3:
  lsr a                          ; $FBC3  4A
  clc                            ; $FBC4  18
  adc z:_var_00f7                ; $FBC5  65 F7
  bcc _label_fbcc                ; $FBC7  90 03
  jmp _label_fc2b                ; $FBC9  4C 2B FC

_label_fbcc:
  sta z:_var_00f7                ; $FBCC  85 F7

_label_fbce:
  rol a                          ; $FBCE  2A
  rol a                          ; $FBCF  2A
  sta APU_PL1_LO                 ; $FBD0  8D 02 40
  rol a                          ; $FBD3  2A
  and #$03                       ; $FBD4  29 03
  ora #$08                       ; $FBD6  09 08
  sta APU_PL1_HI                 ; $FBD8  8D 03 40
  bne _label_fc0f                ; $FBDB  D0 32

_func_fbdd:
  lda z:_var_00f6                ; $FBDD  A5 F6
  bne _label_fc0f                ; $FBDF  D0 2E
  ldy z:_var_00ff                ; $FBE1  A4 FF
  lda z:_var_00f1_indexed        ; $FBE3  A5 F1
  lsr z:_var_00ff                ; $FBE5  46 FF
  bcs _label_fc61                ; $FBE7  B0 78
  lsr a                          ; $FBE9  4A
  bcs _label_fc12                ; $FBEA  B0 26
  lsr z:_var_00ff                ; $FBEC  46 FF
  bcs _label_fc15                ; $FBEE  B0 25
  lsr a                          ; $FBF0  4A
  bcs _label_fb7f                ; $FBF1  B0 8C
  lsr z:_var_00ff                ; $FBF3  46 FF
  bcs _label_fc34                ; $FBF5  B0 3D
  lsr a                          ; $FBF7  4A
  bcs _label_fc27                ; $FBF8  B0 2D
  lsr z:_var_00ff                ; $FBFA  46 FF
  bcs _label_fc45                ; $FBFC  B0 47
  lsr a                          ; $FBFE  4A
  bcs _label_fc54                ; $FBFF  B0 53
  lsr z:_var_00ff                ; $FC01  46 FF
  bcs _label_fbac                ; $FC03  B0 A7
  lsr a                          ; $FC05  4A
  bcs _label_fbbb                ; $FC06  B0 B3
  lsr z:_var_00ff                ; $FC08  46 FF
  bcs _label_fc18                ; $FC0A  B0 0C
  lsr a                          ; $FC0C  4A
  bcs _label_fc27                ; $FC0D  B0 18

_label_fc0f:
  jmp _label_fce2                ; $FC0F  4C E2 FC

_label_fc12:
  jmp _label_fc72                ; $FC12  4C 72 FC

_label_fc15:
  jmp _label_fb6e                ; $FC15  4C 6E FB

_label_fc18:
  sty z:_var_00f1_indexed        ; $FC18  84 F1
  lda #$0A                       ; $FC1A  A9 0A
  sta z:_var_00f7                ; $FC1C  85 F7
  ldx #$96                       ; $FC1E  A2 96
  ldy #$82                       ; $FC20  A0 82
  lda #$18                       ; $FC22  A9 18
  jsr _func_fb40                 ; $FC24  20 40 FB

_label_fc27:
  dec z:_var_00f7                ; $FC27  C6 F7
  bne _label_fc0f                ; $FC29  D0 E4

_label_fc2b:
  jsr _func_ffe3                 ; $FC2B  20 E3 FF
  lda #$00                       ; $FC2E  A9 00
  sta z:_var_00f1_indexed        ; $FC30  85 F1
  beq _label_fc0f                ; $FC32  F0 DB

_label_fc34:
  sty z:_var_00f1_indexed        ; $FC34  84 F1
  lda #$0A                       ; $FC36  A9 0A
  sta z:_var_00f7                ; $FC38  85 F7
  ldx #$83                       ; $FC3A  A2 83
  ldy #$8A                       ; $FC3C  A0 8A
  lda #$18                       ; $FC3E  A9 18
  jsr _func_fb40                 ; $FC40  20 40 FB
  bne _label_fc27                ; $FC43  D0 E2

_label_fc45:
  sty z:_var_00f1_indexed        ; $FC45  84 F1
  lda #$0C                       ; $FC47  A9 0C
  sta z:_var_00f7                ; $FC49  85 F7
  ldx #$85                       ; $FC4B  A2 85
  ldy #$8C                       ; $FC4D  A0 8C
  lda #$02                       ; $FC4F  A9 02
  jsr _func_fb40                 ; $FC51  20 40 FB

_label_fc54:
  lda z:_var_00f7                ; $FC54  A5 F7
  cmp #$0A                       ; $FC56  C9 0A
  bne _label_fc5f                ; $FC58  D0 05
  lda #$8B                       ; $FC5A  A9 8B
  sta APU_PL1_SWEEP              ; $FC5C  8D 01 40

_label_fc5f:
  bne _label_fc27                ; $FC5F  D0 C6

_label_fc61:
  sty z:_var_00f1_indexed        ; $FC61  84 F1
  lda #$29                       ; $FC63  A9 29
  sta z:_var_00f7                ; $FC65  85 F7
  lda #$25                       ; $FC67  A9 25
  sta z:_var_00f8                ; $FC69  85 F8
  ldx #$9C                       ; $FC6B  A2 9C
  ldy #$83                       ; $FC6D  A0 83
  jsr _func_ffdc                 ; $FC6F  20 DC FF

_label_fc72:
  dec z:_var_00f7                ; $FC72  C6 F7
  lda z:_var_00f7                ; $FC74  A5 F7
  beq _label_fc2b                ; $FC76  F0 B3
  cmp #$30                       ; $FC78  C9 30
  bcs _label_fc83                ; $FC7A  B0 07
  lsr a                          ; $FC7C  4A
  lsr a                          ; $FC7D  4A
  ora #$90                       ; $FC7E  09 90
  sta APU_PL1_VOL                ; $FC80  8D 00 40

_label_fc83:
  lda z:_var_00f7                ; $FC83  A5 F7
  and #$03                       ; $FC85  29 03
  bne _label_fca5                ; $FC87  D0 1C
  lda z:_var_00f8                ; $FC89  A5 F8
  lsr a                          ; $FC8B  4A
  lsr a                          ; $FC8C  4A
  lsr a                          ; $FC8D  4A
  lsr a                          ; $FC8E  4A
  sec                            ; $FC8F  38
  adc z:_var_00f8                ; $FC90  65 F8
  sta z:_var_00f8                ; $FC92  85 F8
  asl a                          ; $FC94  0A
  asl a                          ; $FC95  0A
  asl a                          ; $FC96  0A
  sta APU_PL1_LO                 ; $FC97  8D 02 40
  lda z:_var_00f8                ; $FC9A  A5 F8
  rol a                          ; $FC9C  2A
  rol a                          ; $FC9D  2A
  rol a                          ; $FC9E  2A
  rol a                          ; $FC9F  2A
  and #$07                       ; $FCA0  29 07
  sta APU_PL1_HI                 ; $FCA2  8D 03 40

_label_fca5:
  jmp _label_fc0f                ; $FCA5  4C 0F FC

_data_fca8_indexed:
.byte $0e, $0d, $0e, $0d, $0c, $0d, $0c, $0d, $0c, $0b, $0c, $0b ; $FCA8

_label_fcb4:
  sty z:_var_00f2                ; $FCB4  84 F2
  lda #$17                       ; $FCB6  A9 17
  sta z:_var_00f9                ; $FCB8  85 F9
  lda #$08                       ; $FCBA  A9 08
  sta APU_NOISE_HI               ; $FCBC  8D 0F 40
  lda #$09                       ; $FCBF  A9 09
  sta APU_NOISE_VOL              ; $FCC1  8D 0C 40

_label_fcc4:
  lda z:_var_00f9                ; $FCC4  A5 F9
  lsr a                          ; $FCC6  4A
  tay                            ; $FCC7  A8
  lda a:_data_fca8_indexed,Y     ; $FCC8  B9 A8 FC
  sta APU_NOISE_LO               ; $FCCB  8D 0E 40
  jmp _label_fd55                ; $FCCE  4C 55 FD

_label_fcd1:
  sty z:_var_00f2                ; $FCD1  84 F2
  lda #$28                       ; $FCD3  A9 28
  sta z:_var_00f9                ; $FCD5  85 F9
  ldx #$8F                       ; $FCD7  A2 8F
  ldy #$95                       ; $FCD9  A0 95
  lda #$20                       ; $FCDB  A9 20
  jsr _func_fff0                 ; $FCDD  20 F0 FF
  bne _label_fd55                ; $FCE0  D0 73

_label_fce2:
  lda z:_var_00f6                ; $FCE2  A5 F6
  bne _label_fd0d                ; $FCE4  D0 27
  ldy z:_var_00fe                ; $FCE6  A4 FE
  lda z:_var_00f2                ; $FCE8  A5 F2
  lsr z:_var_00fe                ; $FCEA  46 FE
  bcs _label_fcb4                ; $FCEC  B0 C6
  lsr a                          ; $FCEE  4A
  bcs _label_fcc4                ; $FCEF  B0 D3
  lsr z:_var_00fe                ; $FCF1  46 FE
  bcs _label_fcd1                ; $FCF3  B0 DC
  lsr a                          ; $FCF5  4A
  bcs _label_fd55                ; $FCF6  B0 5D
  lsr z:_var_00fe                ; $FCF8  46 FE
  bcs _label_fd24                ; $FCFA  B0 28
  lsr a                          ; $FCFC  4A
  bcs _label_fd33                ; $FCFD  B0 34
  lsr z:_var_00fe                ; $FCFF  46 FE
  bcs _label_fd5c                ; $FD01  B0 59
  lsr a                          ; $FD03  4A
  bcs _label_fd55                ; $FD04  B0 4F
  lsr a                          ; $FD06  4A
  bcs _label_fd55                ; $FD07  B0 4C
  lsr z:_var_00fe                ; $FD09  46 FE
  bcs _label_fd6d                ; $FD0B  B0 60

_label_fd0d:
  jmp _label_fd91                ; $FD0D  4C 91 FD

_label_fd10:
  lda #$00                       ; $FD10  A9 00
  sta z:_var_00f2                ; $FD12  85 F2
  lda #$10                       ; $FD14  A9 10
  sta APU_PL2_VOL                ; $FD16  8D 04 40
  sta APU_NOISE_VOL              ; $FD19  8D 0C 40

_data_fd1c_indexed:
  bne _label_fd0d                ; $FD1C  D0 EF

; data
.byte $8b, $8a, $8b, $82, $83, $82 ; $FD1E

_label_fd24:
  sty z:_var_00f2                ; $FD24  84 F2
  lda #$18                       ; $FD26  A9 18
  sta z:_var_00f9                ; $FD28  85 F9
  lda #$24                       ; $FD2A  A9 24
  jsr _func_fb46                 ; $FD2C  20 46 FB
  lda #$07                       ; $FD2F  A9 07
  sta z:_var_00fa                ; $FD31  85 FA

_label_fd33:
  dec z:_var_00fa                ; $FD33  C6 FA
  bne _label_fd40                ; $FD35  D0 09
  lda #$07                       ; $FD37  A9 07
  sta z:_var_00fa                ; $FD39  85 FA
  lda #$22                       ; $FD3B  A9 22
  jsr _func_fb46                 ; $FD3D  20 46 FB

_label_fd40:
  ldy z:_var_00fa                ; $FD40  A4 FA
  lda a:_data_fd1c_indexed+1,Y   ; $FD42  B9 1D FD
  tay                            ; $FD45  A8
  ldx #$98                       ; $FD46  A2 98
  lda z:_var_00f9                ; $FD48  A5 F9
  cmp #$10                       ; $FD4A  C9 10
  bcs _label_fd52                ; $FD4C  B0 04
  lsr a                          ; $FD4E  4A
  ora #$90                       ; $FD4F  09 90
  tax                            ; $FD51  AA

_label_fd52:
  jsr _func_ffe9                 ; $FD52  20 E9 FF

_label_fd55:
  dec z:_var_00f9                ; $FD55  C6 F9
  beq _label_fd10                ; $FD57  F0 B7
  jmp _label_fd0d                ; $FD59  4C 0D FD

_label_fd5c:
  sty z:_var_00f2                ; $FD5C  84 F2
  lda #$05                       ; $FD5E  A9 05
  sta z:_var_00f9                ; $FD60  85 F9
  ldx #$82                       ; $FD62  A2 82
  ldy #$8B                       ; $FD64  A0 8B
  lda #$00                       ; $FD66  A9 00
  jsr _func_fb40                 ; $FD68  20 40 FB
  bne _label_fd55                ; $FD6B  D0 E8

_label_fd6d:
  sty z:_var_00f2                ; $FD6D  84 F2
  lda #$08                       ; $FD6F  A9 08
  sta z:_var_00f9                ; $FD71  85 F9
  ldx #$80                       ; $FD73  A2 80
  ldy #$7F                       ; $FD75  A0 7F
  jsr _func_ffe9                 ; $FD77  20 E9 FF
  inc a:_var_07f6                ; $FD7A  EE F6 07
  lda a:_var_07f6                ; $FD7D  AD F6 07
  lsr a                          ; $FD80  4A
  ldy #$1D                       ; $FD81  A0 1D
  bcc _label_fd87                ; $FD83  90 02
  ldy #$AB                       ; $FD85  A0 AB

_label_fd87:
  sty APU_PL2_LO                 ; $FD87  8C 06 40
  lda #$19                       ; $FD8A  A9 19
  sta APU_PL2_HI                 ; $FD8C  8D 07 40
  bne _label_fd55                ; $FD8F  D0 C4

_label_fd91:
  lda z:_var_00fd                ; $FD91  A5 FD
  bne _label_fd9a                ; $FD93  D0 05
  lda z:_var_00f6                ; $FD95  A5 F6
  bne _label_fde7                ; $FD97  D0 4E
  rts                            ; $FD99  60

_label_fd9a:
  ldy #$07                       ; $FD9A  A0 07

_label_fd9c:
  asl a                          ; $FD9C  0A
  bcs _label_fda2                ; $FD9D  B0 03
  dey                            ; $FD9F  88
  bne _label_fd9c                ; $FDA0  D0 FA

_label_fda2:
  sty z:_var_00f3                ; $FDA2  84 F3
  lda a:_data_ff3f_indexed,Y     ; $FDA4  B9 3F FF
  tay                            ; $FDA7  A8
  lda a:_data_ff3f_indexed,Y     ; $FDA8  B9 3F FF
  sta a:_var_07f0                ; $FDAB  8D F0 07
  lda a:_data_ff40_indexed,Y     ; $FDAE  B9 40 FF
  sta z:_var_00fb_indexed        ; $FDB1  85 FB
  lda a:_data_ff41_indexed,Y     ; $FDB3  B9 41 FF
  sta z:$FC                      ; $FDB6  85 FC
  lda a:_data_ff42_indexed,Y     ; $FDB8  B9 42 FF
  sta z:_var_00f4                ; $FDBB  85 F4
  lda a:_data_ff43_indexed,Y     ; $FDBD  B9 43 FF
  sta z:_var_00f5                ; $FDC0  85 F5
  lda #$01                       ; $FDC2  A9 01
  sta a:_var_07f1                ; $FDC4  8D F1 07
  sta a:_var_07f2                ; $FDC7  8D F2 07
  sta a:_var_07f3                ; $FDCA  8D F3 07
  ldy #$00                       ; $FDCD  A0 00
  sty z:_var_00f6                ; $FDCF  84 F6
  sty APU_TRI_LINEAR             ; $FDD1  8C 08 40
  lda #$10                       ; $FDD4  A9 10
  sta APU_PL1_VOL                ; $FDD6  8D 00 40
  sta APU_PL2_VOL                ; $FDD9  8D 04 40
  sta APU_NOISE_VOL              ; $FDDC  8D 0C 40
  lda #$7F                       ; $FDDF  A9 7F
  sta APU_PL1_SWEEP              ; $FDE1  8D 01 40
  sta APU_PL2_SWEEP              ; $FDE4  8D 05 40

_label_fde7:
  lda z:_var_00f3                ; $FDE7  A5 F3
  bne _label_fe04                ; $FDE9  D0 19
  lda a:_var_07f5                ; $FDEB  AD F5 07
  beq _label_fe04                ; $FDEE  F0 14
  lda a:_var_07f1                ; $FDF0  AD F1 07
  ldx #$90                       ; $FDF3  A2 90
  cmp #$03                       ; $FDF5  C9 03
  bcc _label_fe01                ; $FDF7  90 08
  ldx #$9D                       ; $FDF9  A2 9D
  and #$07                       ; $FDFB  29 07
  bne _label_fe01                ; $FDFD  D0 02
  ldx #$9A                       ; $FDFF  A2 9A

_label_fe01:
  stx APU_PL2_VOL                ; $FE01  8E 04 40

_label_fe04:
  dec a:_var_07f1                ; $FE04  CE F1 07
  bne _label_fe44                ; $FE07  D0 3B
  ldy z:_var_00f6                ; $FE09  A4 F6
  inc z:_var_00f6                ; $FE0B  E6 F6
  lda (_var_00fb_indexed),Y      ; $FE0D  B1 FB
  bne _label_fe1b                ; $FE0F  D0 0A
  lda #$00                       ; $FE11  A9 00
  ldx #$05                       ; $FE13  A2 05

_label_fe15:
  sta z:_var_00f1_indexed,X      ; $FE15  95 F1
  dex                            ; $FE17  CA
  bpl _label_fe15                ; $FE18  10 FB
  rts                            ; $FE1A  60

_label_fe1b:
  jsr _func_fb5d                 ; $FE1B  20 5D FB
  sta a:_var_07f1                ; $FE1E  8D F1 07
  txa                            ; $FE21  8A
  and #$3E                       ; $FE22  29 3E
  jsr _func_fb46                 ; $FE24  20 46 FB
  sta a:_var_07f5                ; $FE27  8D F5 07
  bne _label_fe30                ; $FE2A  D0 04
  ldx #$90                       ; $FE2C  A2 90
  bne _label_fe41                ; $FE2E  D0 11

_label_fe30:
  ldx #$9D                       ; $FE30  A2 9D
  lda z:_var_00f3                ; $FE32  A5 F3
  beq _label_fe41                ; $FE34  F0 0B
  ldx #$86                       ; $FE36  A2 86
  lda a:_var_07f1                ; $FE38  AD F1 07
  cmp #$08                       ; $FE3B  C9 08
  bcs _label_fe41                ; $FE3D  B0 02
  ldx #$82                       ; $FE3F  A2 82

_label_fe41:
  stx APU_PL2_VOL                ; $FE41  8E 04 40

_label_fe44:
  ldy z:_var_00f5                ; $FE44  A4 F5
  beq _label_fe8b                ; $FE46  F0 43
  lda z:_var_00f3                ; $FE48  A5 F3
  bne _label_fe56                ; $FE4A  D0 0A
  lda a:_var_07f2                ; $FE4C  AD F2 07
  cmp #$03                       ; $FE4F  C9 03
  bcs _label_fe56                ; $FE51  B0 03
  jsr _func_ffe3                 ; $FE53  20 E3 FF

_label_fe56:
  dec a:_var_07f2                ; $FE56  CE F2 07
  bne _label_fe8b                ; $FE59  D0 30
  inc z:_var_00f5                ; $FE5B  E6 F5
  lda (_var_00fb_indexed),Y      ; $FE5D  B1 FB
  jsr _func_fb5d                 ; $FE5F  20 5D FB
  sta a:_var_07f2                ; $FE62  8D F2 07
  txa                            ; $FE65  8A
  and #$3E                       ; $FE66  29 3E
  jsr _func_fb43                 ; $FE68  20 43 FB
  bne _label_fe71                ; $FE6B  D0 04
  ldx #$90                       ; $FE6D  A2 90
  bne _label_fe88                ; $FE6F  D0 17

_label_fe71:
  ldx #$5A                       ; $FE71  A2 5A
  lda z:_var_00f3                ; $FE73  A5 F3
  beq _label_fe88                ; $FE75  F0 11
  ldx #$46                       ; $FE77  A2 46
  lda a:_var_07f2                ; $FE79  AD F2 07
  cmp #$08                       ; $FE7C  C9 08
  bcs _label_fe82                ; $FE7E  B0 02
  ldx #$42                       ; $FE80  A2 42

_label_fe82:
  lda z:_var_00f4                ; $FE82  A5 F4
  bne _label_fe88                ; $FE84  D0 02
  ldx #$86                       ; $FE86  A2 86

_label_fe88:
  stx APU_PL1_VOL                ; $FE88  8E 00 40

_label_fe8b:
  ldy z:_var_00f4                ; $FE8B  A4 F4
  beq _label_fec5                ; $FE8D  F0 36
  lda a:_var_07f3                ; $FE8F  AD F3 07
  cmp #$02                       ; $FE92  C9 02
  bne _label_fe9b                ; $FE94  D0 05
  lda #$00                       ; $FE96  A9 00
  sta APU_TRI_LINEAR             ; $FE98  8D 08 40

_label_fe9b:
  dec a:_var_07f3                ; $FE9B  CE F3 07
  bne _label_fec5                ; $FE9E  D0 25
  inc z:_var_00f4                ; $FEA0  E6 F4
  lda (_var_00fb_indexed),Y      ; $FEA2  B1 FB
  jsr _func_fb5d                 ; $FEA4  20 5D FB
  sta a:_var_07f3                ; $FEA7  8D F3 07
  ldy #$38                       ; $FEAA  A0 38
  clc                            ; $FEAC  18
  adc #$FF                       ; $FEAD  69 FF
  cmp #$0E                       ; $FEAF  C9 0E
  bcs _label_feb6                ; $FEB1  B0 03
  asl a                          ; $FEB3  0A
  asl a                          ; $FEB4  0A
  tay                            ; $FEB5  A8

_label_feb6:
  lda z:_var_00f3                ; $FEB6  A5 F3
  bne _label_febc                ; $FEB8  D0 02
  ldy #$88                       ; $FEBA  A0 88

_label_febc:
  sty APU_TRI_LINEAR             ; $FEBC  8C 08 40
  txa                            ; $FEBF  8A
  and #$3E                       ; $FEC0  29 3E
  jmp _label_fb49                ; $FEC2  4C 49 FB

_label_fec5:
  rts                            ; $FEC5  60

; data
.byte $8a, $4a, $4a, $ca, $84, $8e, $4e, $4e, $ce, $8a, $92, $52, $52, $d2, $82, $98 ; $FEC6
.byte $58, $58, $99, $00, $84, $44, $44, $c4, $82, $8a, $4a, $4a, $ca, $84, $8e, $4e ; $FED6
.byte $4e, $ce, $8a, $92, $52, $52, $93, $8a, $4a, $4a, $ca, $8a, $8e, $4e, $4e, $ce ; $FEE6
.byte $8e, $92, $52, $52, $d2, $92, $98, $58, $58, $99 ; $FEF6

_data_ff00_indexed:
.byte $06                        ; $FF00

_data_ff01_indexed:
.byte $ae, $02, $a6, $02, $3a, $01, $fc, $01, $c4, $01, $ab, $01, $7c, $01, $52, $01 ; $FF01
.byte $3f, $01, $1c, $00, $fd, $00, $e1, $00, $d4, $00, $bd, $00, $a8, $00, $8d, $00 ; $FF11
.byte $69, $00, $24, $00, $20, $00, $00 ; $FF21

_data_ff28_indexed:
.byte $03, $06, $0c, $18, $30, $12, $24, $04, $05, $0a, $14, $28, $50, $1e, $3c, $05 ; $FF28
.byte $0b, $16, $2c, $58, $21, $42, $06 ; $FF38

_data_ff3f_indexed:
.byte $08                        ; $FF3F

_data_ff40_indexed:
.byte $0d                        ; $FF40

_data_ff41_indexed:
.byte $03                        ; $FF41

_data_ff42_indexed:
.byte $0f                        ; $FF42

_data_ff43_indexed:
.byte $51, $ff, $00, $00, $00, $c6, $fe, $27, $14, $0f, $5a, $ff, $49, $1d, $20, $1e ; $FF43
.byte $20, $1e, $20, $1e, $20, $5e, $00, $9c, $9c, $5a, $59, $9a, $9a, $58, $57, $98 ; $FF53
.byte $98, $56, $94, $13, $66, $9c, $9c, $5a, $59, $9a, $9a, $58, $57, $98, $98, $56 ; $FF63
.byte $98, $5a, $19, $00, $98, $98, $56, $4a, $4e, $52, $96, $96, $54, $48, $4c, $52 ; $FF73
.byte $94, $94, $52, $46, $4a, $0f, $66, $66, $52, $4e, $52, $66, $4e, $4a, $4e, $66 ; $FF83
.byte $56, $52, $56, $66, $52, $4c, $52, $66, $50, $4a, $50, $66, $4c, $48, $4c, $0b ; $FF93
.byte $4a, $8a, $44, $4a, $8a, $44, $52, $92, $4c, $52, $92, $4c, $50, $90, $4a, $50 ; $FFA3
.byte $90, $4a, $4a, $44, $44, $44, $44, $46, $48, $4a, $4a, $4a, $4a, $4a, $44, $44 ; $FFB3
.byte $44, $44, $52, $52, $52, $52, $4c, $4c, $4c, $4c, $50, $50, $50, $50, $44, $44 ; $FFC3
.byte $44, $44, $0a, $c5, $26, $44, $c7, $48, $0b ; $FFD3

_func_ffdc:
  stx APU_PL1_VOL                ; $FFDC  8E 00 40
  sty APU_PL1_SWEEP              ; $FFDF  8C 01 40
  rts                            ; $FFE2  60

_func_ffe3:
  lda #$90                       ; $FFE3  A9 90
  sta APU_PL1_VOL                ; $FFE5  8D 00 40
  rts                            ; $FFE8  60

_func_ffe9:
  stx APU_PL2_VOL                ; $FFE9  8E 04 40
  sty APU_PL2_SWEEP              ; $FFEC  8C 05 40
  rts                            ; $FFEF  60

_func_fff0:
  jsr _func_ffe9                 ; $FFF0  20 E9 FF
  jmp _func_fb46                 ; $FFF3  4C 46 FB

.byte $ff                        ; $FFF6

_func_fff7:
  jmp _label_fb2c                ; $FFF7  4C 2C FB

.segment "TILES"

.byte $00, $00, $00, $07, $05, $05, $0f, $07, $00, $07, $0f, $07, $07, $07, $0f, $07
.byte $00, $00, $00, $80, $80, $80, $40, $c0, $00, $c0, $e0, $e0, $e0, $e0, $f6, $fc
.byte $03, $21, $63, $7f, $1f, $04, $03, $03, $03, $21, $61, $60, $00, $03, $00, $00
.byte $80, $c0, $e0, $e0, $b0, $3c, $dc, $d0, $f8, $3c, $10, $08, $00, $8c, $1c, $10
.byte $07, $07, $0f, $0f, $0f, $1f, $00, $00, $00, $00, $00, $01, $0e, $00, $0c, $1c
.byte $e0, $f8, $f8, $f0, $c0, $00, $00, $00, $00, $10, $60, $8c, $1c, $08, $08, $00
.byte $00, $00, $07, $05, $05, $0f, $07, $03, $07, $0f, $07, $07, $07, $0f, $07, $03
.byte $00, $00, $80, $80, $80, $40, $c0, $80, $c0, $e0, $e0, $e0, $e0, $f0, $f8, $fc
.byte $01, $03, $07, $07, $0c, $07, $03, $07, $01, $01, $00, $00, $0f, $04, $00, $00
.byte $c0, $e0, $e0, $f0, $70, $e0, $c0, $c0, $34, $10, $18, $04, $80, $c0, $c0, $80
.byte $07, $0f, $0f, $0f, $1f, $01, $00, $00, $00, $00, $00, $0f, $00, $06, $0e, $01
.byte $e0, $e0, $f0, $f0, $f8, $e0, $00, $00, $00, $00, $00, $70, $c0, $00, $c0, $c0
.byte $01, $01, $03, $12, $3d, $3f, $07, $03, $01, $00, $00, $11, $32, $30, $00, $00
.byte $c0, $e0, $e0, $e0, $c0, $f0, $30, $c0, $30, $18, $0c, $00, $20, $30, $f0, $00
.byte $07, $2f, $1f, $0f, $03, $00, $00, $00, $00, $08, $06, $11, $78, $18, $00, $00
.byte $e0, $e0, $e0, $f8, $f0, $e0, $00, $00, $00, $00, $00, $90, $60, $18, $30, $60
.byte $01, $03, $07, $07, $0c, $3b, $0b, $07, $01, $01, $00, $00, $03, $38, $08, $00
.byte $c0, $e0, $f0, $f8, $38, $de, $ce, $e8, $30, $18, $04, $00, $80, $0e, $0e, $08
.byte $07, $0f, $0f, $0f, $1f, $07, $00, $00, $00, $00, $00, $0c, $03, $00, $06, $0e
.byte $e0, $e0, $f0, $f0, $f8, $f0, $00, $00, $00, $00, $00, $10, $e0, $00, $60, $70
.byte $00, $00, $00, $0e, $0b, $1b, $3f, $31, $28, $3f, $1f, $0f, $0f, $1f, $3f, $31
.byte $00, $00, $00, $00, $00, $40, $c0, $80, $00, $80, $c0, $c0, $c0, $ec, $f8, $f0
.byte $19, $0f, $1f, $3f, $f7, $e7, $20, $03, $19, $0f, $02, $00, $c0, $e0, $23, $00
.byte $e0, $fe, $ff, $cc, $c4, $b0, $78, $fe, $98, $06, $07, $04, $04, $40, $80, $04
.byte $07, $07, $07, $0f, $07, $00, $00, $00, $00, $00, $00, $07, $00, $00, $00, $00
.byte $fc, $fc, $f8, $f0, $c0, $00, $00, $00, $08, $10, $66, $87, $23, $60, $20, $00
.byte $00, $00, $00, $00, $07, $05, $05, $0f, $00, $02, $07, $17, $1f, $0f, $07, $0f
.byte $00, $00, $00, $00, $c0, $60, $50, $f0, $80, $80, $e0, $f0, $f2, $f4, $fe, $fc
.byte $0c, $0c, $0e, $0f, $07, $26, $3a, $3f, $0f, $0f, $07, $01, $00, $01, $01, $01
.byte $60, $70, $78, $f8, $f0, $e6, $de, $fe, $fc, $e8, $e0, $c0, $00, $00, $24, $c4
.byte $1f, $0f, $07, $0f, $0e, $0c, $00, $00, $03, $01, $00, $1f, $1e, $1c, $18, $00
.byte $fc, $f8, $f0, $78, $78, $30, $00, $00, $88, $00, $16, $7e, $7e, $32, $00, $00
.byte $00, $00, $07, $0d, $07, $03, $07, $1f, $00, $0f, $07, $0f, $07, $03, $01, $00
.byte $00, $00, $c0, $a0, $e0, $c0, $f0, $f8, $00, $f0, $f0, $fa, $fc, $f8, $8c, $06
.byte $7f, $10, $07, $0f, $1f, $1f, $1f, $00, $70, $13, $00, $00, $00, $1f, $00, $3c
.byte $dc, $0e, $ec, $f0, $f8, $f8, $f8, $00, $00, $ce, $0c, $00, $00, $f8, $00, $3c
.byte $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00
.byte $0f, $09, $0f, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00
.byte $ff, $99, $ff, $00, $01, $01, $00, $07, $00, $00, $00, $00, $07, $07, $1f, $07
.byte $ff, $99, $ff, $e0, $e0, $c0, $c0, $00, $00, $00, $60, $e0, $e0, $c0, $20, $e0
.byte $3a, $7e, $3e, $1e, $0e, $02, $02, $02, $01, $09, $3d, $01, $01, $07, $0f, $1f
.byte $30, $30, $38, $30, $00, $00, $00, $00, $d0, $d0, $f8, $d0, $c0, $e0, $e0, $e0
.byte $06, $07, $1f, $1f, $0f, $0f, $00, $00, $1f, $1f, $1b, $1f, $0f, $0f, $07, $0f
.byte $20, $20, $e0, $f0, $f8, $78, $00, $00, $e0, $e0, $e8, $fc, $fe, $7a, $00, $00
.byte $ff, $99, $ff, $00, $00, $00, $03, $1d, $00, $00, $00, $03, $03, $0f, $03, $1d
.byte $ff, $99, $ff, $f0, $e0, $60, $80, $10, $00, $00, $70, $f0, $e0, $90, $f0, $f0
.byte $3f, $1f, $0f, $07, $01, $01, $01, $03, $04, $1e, $00, $00, $03, $07, $0f, $0f
.byte $18, $1c, $18, $00, $00, $00, $80, $80, $e8, $fc, $e8, $e0, $f0, $f0, $f0, $f0
.byte $0f, $0f, $0f, $07, $00, $00, $00, $00, $0d, $0f, $0b, $07, $07, $0f, $00, $00
.byte $90, $f0, $f0, $f0, $f0, $e0, $00, $00, $f0, $f0, $f0, $f0, $f0, $e0, $e0, $e0
.byte $3f, $1f, $0f, $07, $00, $00, $00, $01, $04, $1e, $00, $00, $01, $03, $07, $07
.byte $18, $1c, $18, $00, $80, $80, $80, $88, $e8, $fc, $e8, $f0, $f0, $f0, $f0, $f8
.byte $07, $07, $0f, $0f, $07, $00, $00, $00, $06, $07, $2f, $3f, $1f, $08, $00, $00
.byte $d8, $f8, $f8, $fc, $fc, $38, $00, $00, $f8, $f8, $f8, $fc, $fe, $3e, $06, $0c
.byte $00, $00, $00, $00, $00, $7f, $7f, $7f, $00, $00, $00, $00, $00, $7f, $00, $7f
.byte $00, $00, $00, $00, $00, $ff, $ff, $ff, $00, $00, $00, $00, $00, $ff, $00, $ff
.byte $00, $00, $00, $00, $00, $3c, $3c, $3c, $00, $00, $00, $00, $00, $3c, $00, $3c
.byte $00, $3f, $3f, $3f, $00, $00, $00, $00, $3f, $40, $40, $40, $3f, $00, $00, $00
.byte $00, $00, $00, $06, $0e, $1c, $18, $10, $03, $0f, $1f, $39, $71, $63, $e7, $ef
.byte $00, $00, $00, $00, $00, $00, $00, $00, $c0, $f0, $f8, $fc, $fe, $fe, $ff, $ff
.byte $00, $00, $00, $00, $00, $00, $00, $00, $ff, $ff, $ff, $ff, $ff, $ff, $ff, $ff
.byte $00, $00, $00, $00, $00, $00, $00, $00, $c3, $81, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $81, $c3
.byte $00, $00, $00, $00, $00, $00, $00, $00, $ff, $ff, $7f, $7f, $3f, $1f, $0f, $03
.byte $02, $02, $03, $03, $03, $03, $02, $02, $02, $02, $03, $03, $03, $03, $02, $02
.byte $02, $06, $04, $0c, $0c, $08, $08, $00, $0e, $06, $04, $0c, $0c, $08, $08, $00
.byte $04, $04, $0c, $08, $08, $00, $00, $00, $0c, $04, $0c, $08, $08, $00, $00, $00
.byte $06, $06, $03, $03, $03, $03, $06, $06, $06, $06, $03, $0f, $0f, $03, $06, $06
.byte $06, $06, $0c, $0c, $0c, $08, $08, $08, $06, $06, $0c, $0c, $0c, $08, $08, $08
.byte $00, $00, $00, $00, $00, $38, $1e, $0f, $00, $00, $00, $00, $00, $38, $1e, $0f
.byte $38, $18, $0c, $0c, $06, $02, $00, $00, $38, $38, $0c, $0c, $06, $02, $00, $00
.byte $00, $00, $01, $01, $03, $03, $03, $03, $00, $00, $01, $01, $03, $03, $03, $03
.byte $03, $06, $06, $0e, $1c, $38, $70, $40, $03, $0e, $0e, $0e, $1c, $38, $70, $40
.byte $00, $40, $20, $30, $18, $1c, $0e, $07, $00, $40, $20, $30, $18, $1c, $0e, $07
.byte $38, $1c, $0c, $0c, $06, $06, $06, $06, $38, $1c, $1c, $3c, $16, $06, $06, $06
.byte $03, $03, $03, $03, $01, $01, $00, $00, $03, $03, $03, $03, $01, $01, $00, $00
.byte $00, $00, $10, $08, $08, $0c, $06, $06, $00, $00, $10, $08, $08, $0c, $06, $06
.byte $30, $38, $18, $0c, $0c, $0c, $0c, $0c, $30, $38, $18, $3c, $1c, $0c, $0c, $0c
.byte $06, $06, $06, $06, $06, $02, $02, $02, $06, $06, $06, $06, $06, $02, $02, $02
.byte $00, $00, $00, $00, $00, $00, $00, $00, $ff, $ff, $fe, $fe, $fc, $f8, $f0, $c0
.byte $00, $00, $0c, $1c, $14, $1f, $3e, $0e, $00, $0f, $03, $03, $03, $07, $3f, $01
.byte $00, $00, $00, $00, $00, $00, $00, $00, $00, $80, $c0, $c0, $e0, $e0, $f8, $fc
.byte $0f, $0f, $0f, $0f, $07, $07, $1f, $00, $00, $00, $00, $00, $00, $04, $1f, $00
.byte $00, $00, $80, $c8, $f8, $d0, $30, $00, $e0, $f0, $78, $38, $18, $10, $30, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00, $00, $07, $0f, $1f, $1f, $3f, $3f, $3f
.byte $00, $00, $00, $00, $00, $00, $00, $00, $3f, $3f, $1f, $1f, $0f, $07, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00, $80, $c0, $e0, $f0, $f8, $fc, $fe, $ff
.byte $00, $00, $00, $00, $00, $00, $00, $00, $ff, $7f, $3f, $1f, $0f, $07, $03, $01
.byte $18, $3c, $3c, $3c, $18, $00, $00, $00, $18, $3c, $3c, $3c, $18, $00, $00, $00
.byte $7b, $73, $73, $73, $74, $78, $7f, $7f, $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $0f, $0f, $00, $00, $0f, $0f, $00, $00, $0f, $0f, $00, $00, $0f, $0f, $00
.byte $00, $fe, $fe, $00, $00, $fe, $fe, $00, $00, $fe, $fe, $00, $00, $fe, $fe, $00
.byte $ff, $fd, $fd, $fd, $f9, $fb, $76, $3c, $00, $02, $02, $02, $06, $04, $08, $00
.byte $10, $22, $00, $00, $87, $c6, $62, $30, $00, $10, $00, $86, $48, $20, $18, $00
.byte $00, $03, $07, $00, $00, $1f, $1f, $00, $00, $03, $07, $00, $00, $1f, $1f, $00
.byte $00, $e0, $f0, $80, $80, $fc, $fc, $00, $00, $e0, $f0, $00, $00, $fc, $fc, $00
.byte $38, $6c, $c6, $c6, $fe, $c6, $c6, $00, $00, $00, $00, $00, $00, $00, $00, $00
.byte $fc, $c6, $c6, $fc, $c6, $c6, $fc, $00, $00, $00, $00, $00, $00, $00, $00, $00
.byte $3c, $66, $c0, $c0, $c0, $66, $3c, $00, $00, $00, $00, $00, $00, $00, $00, $00
.byte $f8, $cc, $c6, $c6, $c6, $cc, $f8, $00, $00, $00, $00, $00, $00, $00, $00, $00
.byte $fe, $c0, $c0, $fc, $c0, $c0, $fe, $00, $00, $00, $00, $00, $00, $00, $00, $00
.byte $3e, $60, $c0, $ce, $c6, $66, $3e, $00, $00, $00, $00, $00, $00, $00, $00, $00
.byte $7e, $18, $18, $18, $18, $18, $7e, $00, $00, $00, $00, $00, $00, $00, $00, $00
.byte $60, $60, $60, $60, $60, $60, $7e, $00, $00, $00, $00, $00, $00, $00, $00, $00
.byte $c6, $ee, $fe, $fe, $d6, $c6, $c6, $00, $00, $00, $00, $00, $00, $00, $00, $00
.byte $c6, $e6, $f6, $fe, $de, $ce, $c6, $00, $00, $00, $00, $00, $00, $00, $00, $00
.byte $7c, $c6, $c6, $c6, $c6, $c6, $7c, $00, $00, $00, $00, $00, $00, $00, $00, $00
.byte $fc, $c6, $c6, $c6, $fc, $c0, $c0, $00, $00, $00, $00, $00, $00, $00, $00, $00
.byte $fc, $c6, $c6, $ce, $f8, $dc, $ce, $00, $00, $00, $00, $00, $00, $00, $00, $00
.byte $7e, $18, $18, $18, $18, $18, $18, $00, $00, $00, $00, $00, $00, $00, $00, $00
.byte $66, $66, $66, $3c, $18, $18, $18, $00, $00, $00, $00, $00, $00, $00, $00, $00
.byte $3c, $42, $99, $a1, $a1, $99, $42, $3c, $00, $00, $00, $00, $00, $00, $00, $00
.byte $60, $61, $63, $67, $63, $61, $60, $00, $60, $61, $63, $67, $63, $61, $60, $00
.byte $ff, $ef, $cf, $ef, $ef, $ef, $ff, $00, $ff, $ef, $cf, $ef, $ef, $ef, $ff, $00
.byte $ff, $c7, $f7, $c7, $df, $c7, $ff, $00, $ff, $c7, $f7, $c7, $df, $c7, $ff, $00
.byte $ff, $c7, $f7, $e7, $f7, $c7, $ff, $00, $ff, $c7, $f7, $e7, $f7, $c7, $ff, $00
.byte $ff, $f7, $e7, $d7, $c3, $f7, $ff, $00, $ff, $f7, $e7, $d7, $c3, $f7, $ff, $00
.byte $ff, $c7, $df, $c7, $f7, $c7, $ff, $00, $ff, $c7, $df, $c7, $f7, $c7, $ff, $00
.byte $ff, $c7, $df, $c7, $d7, $c7, $ff, $00, $ff, $c7, $df, $c7, $d7, $c7, $ff, $00
.byte $ff, $c7, $f7, $ef, $ef, $ef, $ff, $00, $ff, $c7, $f7, $ef, $ef, $ef, $ff, $00
.byte $60, $60, $60, $60, $60, $60, $60, $00, $60, $60, $60, $60, $60, $60, $60, $00
.byte $7f, $7f, $7f, $7f, $7f, $7f, $7f, $7f, $00, $00, $00, $00, $00, $00, $00, $00
.byte $c6, $c6, $c6, $ee, $7c, $38, $10, $00, $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $06, $06, $00, $60, $e0, $e0, $1c, $1e, $1d, $39, $3f, $1f, $1f, $1e
.byte $1c, $1c, $1c, $1c, $0c, $04, $00, $00, $03, $03, $03, $23, $73, $f3, $03, $01
.byte $00, $00, $00, $00, $40, $60, $00, $00, $e0, $e4, $f4, $ff, $be, $98, $c0, $e0
.byte $7f, $7f, $78, $74, $73, $73, $73, $77, $00, $00, $00, $00, $00, $00, $00, $00
.byte $7f, $7f, $78, $7c, $7f, $7f, $7f, $7c, $00, $00, $00, $00, $00, $00, $00, $00
.byte $fe, $fe, $1e, $2e, $ce, $ce, $ce, $2e, $00, $00, $00, $00, $00, $00, $00, $00
.byte $5e, $ce, $ce, $ce, $2e, $1e, $fe, $fe, $00, $00, $00, $00, $00, $00, $00, $00
.byte $7e, $7f, $7f, $7f, $7c, $78, $7f, $7f, $00, $00, $00, $00, $00, $00, $00, $00
.byte $de, $ce, $ce, $ce, $ee, $fe, $fe, $fe, $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $3c, $56, $56, $00, $00, $00, $00, $00, $3c, $7e, $7e
.byte $7e, $0c, $18, $3c, $7e, $7e, $3c, $00, $7e, $fc, $18, $3c, $7e, $7e, $3c, $66
.byte $00, $00, $06, $06, $60, $60, $70, $f0, $0c, $1e, $3a, $78, $1e, $1e, $0e, $0e
.byte $38, $38, $38, $1c, $1c, $0e, $00, $00, $07, $07, $07, $23, $63, $f1, $01, $00
.byte $00, $00, $00, $00, $00, $30, $00, $00, $c0, $c0, $e4, $fe, $fb, $c0, $e0, $f0
.byte $18, $38, $18, $18, $18, $18, $7e, $00, $00, $00, $00, $00, $00, $00, $00, $00
.byte $7c, $c6, $0e, $3c, $78, $e0, $fe, $00, $00, $00, $00, $00, $00, $00, $00, $00
.byte $7e, $0c, $18, $3c, $06, $c6, $7c, $00, $00, $00, $00, $00, $00, $00, $00, $00
.byte $7c, $c6, $c6, $7c, $c6, $c6, $7c, $00, $00, $00, $00, $00, $00, $00, $00, $00
.byte $7c, $c6, $c6, $7e, $06, $0c, $78, $00, $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $06, $06, $04, $00, $00, $00, $07, $0f, $09, $19, $1b
.byte $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $c0, $e0, $e0, $f0, $f0
.byte $00, $00, $00, $00, $00, $00, $00, $00, $1f, $1f, $0f, $0f, $07, $00, $00, $00
.byte $00, $00, $00, $00, $00, $06, $06, $04, $00, $00, $00, $07, $0f, $09, $19, $1b
.byte $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $c0, $e0, $e0, $f0, $f0
.byte $00, $00, $00, $00, $00, $00, $00, $00, $1f, $1f, $0f, $0f, $07, $00, $00, $00
.byte $00, $00, $60, $40, $00, $00, $00, $00, $38, $7c, $9e, $be, $fe, $fe, $7c, $38
.byte $00, $00, $00, $20, $00, $00, $00, $00, $00, $00, $38, $5c, $7c, $7c, $38, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $30, $30, $00, $00, $00
.byte $00, $00, $00, $3c, $56, $56, $7e, $0d, $00, $00, $00, $3c, $7e, $7e, $7e, $fd
.byte $db, $ff, $7e, $3c, $18, $00, $00, $00, $db, $ff, $7e, $3c, $18, $66, $42, $00
.byte $00, $00, $38, $74, $60, $43, $08, $00, $00, $00, $00, $08, $10, $20, $01, $80
.byte $00, $00, $02, $07, $05, $1f, $07, $01, $00, $03, $05, $00, $00, $1f, $07, $07
.byte $00, $00, $c0, $e0, $60, $c0, $80, $f0, $00, $e0, $30, $10, $10, $30, $f8, $88
.byte $00, $00, $00, $00, $01, $03, $1f, $00, $07, $07, $07, $07, $06, $0c, $1f, $00
.byte $f8, $78, $78, $38, $f8, $f0, $7c, $00, $00, $80, $80, $c0, $00, $00, $7c, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $01
.byte $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $3c, $ff, $ff
.byte $00, $18, $18, $18, $18, $18, $18, $18, $01, $03, $03, $03, $03, $03, $03, $01
.byte $00, $00, $00, $00, $00, $00, $00, $00, $ff, $ff, $ff, $ff, $ff, $ff, $ff, $ff
.byte $1c, $0c, $0e, $07, $03, $01, $00, $00, $01, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $c3, $ff, $7e, $00, $ff, $ff, $3c, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $04, $0e, $0c, $1c, $00, $00, $00, $00, $00, $00, $00, $01
.byte $18, $18, $18, $18, $18, $18, $18, $18, $01, $03, $03, $03, $03, $03, $03, $01
.byte $00, $00, $00, $00, $00, $18, $18, $18, $80, $c0, $c0, $c0, $c0, $c0, $c0, $80
.byte $00, $60, $e0, $c0, $00, $00, $00, $00, $00, $00, $00, $00, $00, $3c, $ff, $ff
.byte $00, $00, $00, $00, $00, $00, $00, $00, $80, $c0, $c0, $c0, $c0, $c0, $c0, $80
.byte $00, $00, $60, $e0, $c0, $80, $00, $00, $80, $00, $00, $00, $00, $00, $00, $00
.byte $00, $7e, $fe, $c2, $00, $00, $00, $00, $00, $00, $00, $00, $00, $3c, $ff, $ff
.byte $00, $00, $00, $00, $00, $00, $00, $00, $fc, $fe, $ff, $ff, $ff, $ff, $fe, $fc
.byte $00, $00, $00, $00, $00, $00, $00, $00, $c3, $81, $00, $00, $00, $00, $81, $c3
.byte $00, $00, $00, $00, $18, $3c, $7e, $7e, $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $01, $07, $1f, $7f, $7f, $7f, $00, $00, $00, $00, $00, $00, $80, $80
.byte $00, $00, $80, $80, $80, $80, $80, $80, $00, $00, $00, $00, $00, $00, $00, $00
.byte $39, $39, $1f, $1f, $0f, $0f, $04, $00, $46, $46, $20, $20, $10, $10, $0b, $0c
.byte $c0, $c0, $c0, $c0, $c0, $00, $00, $00, $00, $00, $00, $00, $00, $c0, $00, $00
.byte $00, $00, $b8, $98, $98, $8c, $8c, $8c, $00, $00, $00, $60, $20, $10, $10, $10
.byte $c6, $c6, $c6, $ce, $d8, $00, $00, $00, $08, $08, $08, $00, $20, $c0, $00, $00
.byte $00, $f0, $fe, $fe, $fe, $fe, $fc, $cc, $00, $00, $00, $01, $01, $01, $02, $32
.byte $cc, $f8, $f8, $f8, $f0, $f0, $00, $00, $32, $04, $04, $04, $08, $08, $f8, $00
.byte $00, $00, $3e, $30, $30, $30, $30, $30, $00, $00, $01, $08, $08, $08, $08, $08
.byte $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00
.byte $02, $07, $0d, $07, $03, $01, $00, $00, $00, $00, $02, $08, $04, $02, $01, $00
.byte $00, $00, $80, $c0, $e0, $f0, $f8, $7c, $00, $00, $00, $00, $00, $00, $00, $80
.byte $3e, $1b, $0e, $04, $00, $00, $00, $00, $40, $24, $11, $0a, $04, $00, $00, $00
.byte $02, $07, $0d, $07, $13, $21, $40, $c0, $00, $00, $02, $08, $04, $02, $01, $00
.byte $60, $30, $18, $0c, $06, $03, $01, $00, $00, $00, $00, $00, $00, $00, $00, $00
.byte $3e, $1b, $0e, $04, $08, $10, $a0, $c0, $40, $24, $11, $0a, $04, $00, $00, $00
.byte $00, $80, $c0, $f0, $f8, $fe, $ff, $ff, $00, $00, $00, $80, $e0, $f0, $fc, $fe
.byte $00, $00, $00, $c0, $e0, $f8, $fc, $ff, $00, $00, $00, $00, $80, $c0, $f0, $f8
.byte $ff, $ff, $ff, $ff, $3f, $07, $00, $00, $ff, $ff, $ff, $1f, $03, $00, $00, $00
.byte $ff, $ff, $ff, $1f, $03, $00, $00, $00, $fe, $7f, $0f, $01, $00, $00, $00, $00
.byte $80, $e0, $f0, $f8, $fc, $7c, $00, $00, $00, $00, $c0, $e0, $30, $00, $00, $00
.byte $ff, $ff, $ff, $ff, $ff, $ff, $ff, $ff, $00, $ff, $ff, $ff, $ff, $ff, $fe, $e0
.byte $ff, $ff, $ff, $ff, $ff, $ff, $f0, $00, $00, $ff, $ff, $ff, $fe, $e0, $00, $00
.byte $fe, $ff, $ff, $fe, $f0, $00, $00, $00, $00, $fe, $fe, $e0, $00, $00, $00, $00
.byte $f0, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $07, $3f, $ff, $ff, $ff, $00, $00, $00, $00, $03, $1f, $ff, $ff
.byte $03, $1f, $ff, $ff, $ff, $ff, $fc, $f8, $00, $01, $0f, $7f, $fe, $f8, $f0, $c0
.byte $00, $7c, $fc, $f8, $f0, $e0, $80, $00, $00, $00, $30, $e0, $c0, $00, $00, $00
.byte $ff, $ff, $ff, $fe, $f8, $f0, $c0, $80, $ff, $fe, $fc, $f0, $e0, $80, $00, $00
.byte $e0, $c0, $00, $00, $00, $00, $00, $00, $80, $00, $00, $00, $00, $00, $00, $00
.byte $03, $07, $0e, $1c, $38, $70, $e0, $c0, $03, $17, $3e, $7c, $38, $70, $e0, $c0
.byte $01, $03, $06, $0c, $18, $30, $60, $c0, $01, $03, $06, $0c, $18, $30, $60, $c0
.byte $00, $01, $03, $05, $07, $1e, $07, $06, $00, $00, $00, $00, $00, $1f, $07, $01
.byte $00, $00, $80, $80, $80, $00, $00, $00, $00, $e0, $70, $70, $70, $f0, $f0, $f0
.byte $2f, $2f, $2f, $3f, $1f, $17, $00, $00, $20, $20, $20, $30, $10, $10, $00, $00
.byte $00, $00, $00, $00, $80, $f8, $f0, $00, $f8, $fc, $fe, $f0, $78, $38, $f0, $00
.byte $00, $00, $01, $03, $02, $03, $02, $07, $00, $03, $06, $24, $24, $35, $3e, $3f
.byte $00, $00, $40, $e0, $a0, $e0, $20, $f0, $00, $e0, $b0, $12, $12, $d6, $3e, $fe
.byte $03, $03, $07, $07, $0f, $07, $00, $00, $1c, $0c, $0b, $0f, $06, $06, $00, $00
.byte $e0, $e0, $f0, $f0, $e0, $e0, $f8, $00, $1c, $18, $08, $08, $10, $60, $f8, $00
.byte $00, $00, $01, $03, $03, $01, $00, $00, $00, $03, $06, $04, $04, $06, $07, $0f
.byte $00, $00, $a0, $f0, $50, $fc, $f0, $f0, $00, $e0, $50, $00, $00, $7c, $f0, $c8
.byte $00, $01, $01, $01, $01, $03, $1f, $00, $1f, $3e, $3e, $26, $06, $04, $1f, $00
.byte $f8, $f8, $f8, $f8, $f8, $f0, $7c, $00, $04, $04, $06, $02, $00, $00, $7c, $00
.byte $00, $00, $01, $03, $02, $03, $01, $03, $00, $03, $06, $04, $04, $04, $07, $0f
.byte $00, $00, $40, $e0, $a0, $e0, $c0, $e0, $00, $e0, $b0, $10, $10, $90, $f0, $f8
.byte $03, $07, $07, $07, $07, $07, $1f, $00, $0c, $08, $18, $18, $00, $04, $1f, $00
.byte $e0, $f0, $f0, $f0, $f0, $e0, $78, $00, $18, $08, $0c, $0c, $00, $20, $78, $00
.byte $00, $00, $00, $00, $00, $00, $0f, $00, $00, $00, $00, $00, $00, $00, $00, $07
.byte $00, $00, $00, $00, $00, $00, $f8, $00, $00, $00, $00, $00, $00, $00, $00, $f0
.byte $00, $01, $0f, $00, $00, $00, $01, $0f, $00, $00, $00, $07, $00, $00, $00, $00
.byte $38, $e0, $00, $00, $00, $38, $e0, $00, $00, $00, $00, $80, $f0, $00, $00, $00
.byte $00, $00, $00, $01, $0f, $00, $00, $00, $07, $00, $00, $00, $00, $07, $01, $00
.byte $00, $00, $38, $e0, $00, $00, $00, $00, $80, $f0, $00, $00, $00, $00, $c0, $70
.byte $00, $03, $0e, $00, $00, $03, $0e, $00, $00, $00, $00, $07, $00, $00, $00, $07
.byte $38, $e0, $00, $00, $38, $e0, $00, $00, $00, $00, $00, $f0, $00, $00, $00, $f0
.byte $00, $0f, $00, $00, $0f, $00, $00, $0f, $00, $00, $07, $00, $00, $07, $00, $00
.byte $f8, $80, $00, $f8, $80, $00, $f8, $80, $00, $00, $f0, $00, $00, $f0, $00, $00
.byte $00, $00, $0f, $00, $00, $0f, $00, $00, $07, $00, $00, $07, $00, $00, $07, $00
.byte $00, $f8, $80, $00, $f8, $80, $00, $f8, $f0, $00, $00, $f0, $00, $00, $f0, $00
.byte $00, $00, $00, $0f, $00, $00, $0f, $00, $00, $00, $00, $00, $07, $00, $00, $07
.byte $00, $00, $00, $f8, $00, $f8, $80, $00, $00, $00, $00, $00, $f0, $00, $00, $f0
.byte $00, $00, $00, $00, $6c, $6c, $08, $00, $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $60, $60, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00
.byte $38, $7c, $fe, $fe, $fe, $fe, $7c, $38, $10, $34, $32, $32, $32, $32, $34, $10
.byte $00, $02, $06, $02, $02, $02, $02, $00, $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $0e, $02, $0e, $08, $08, $0e, $00, $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $0e, $02, $0e, $02, $02, $0e, $00, $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $04, $14, $14, $14, $1e, $04, $00, $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $0e, $08, $0e, $02, $02, $0e, $00, $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $0e, $08, $0e, $0a, $0a, $0e, $00, $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $0e, $0a, $02, $02, $02, $02, $00, $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $0e, $0a, $0e, $0a, $0a, $0e, $00, $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $0e, $0a, $0e, $02, $02, $0e, $00, $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $2e, $6a, $2a, $2a, $2a, $2e, $00, $00, $00, $00, $00, $00, $00, $00, $00
.byte $1c, $3e, $7f, $7f, $7f, $7f, $3e, $1c, $14, $24, $66, $66, $66, $66, $24, $14
.byte $00, $00, $44, $28, $10, $28, $44, $00, $00, $00, $44, $28, $10, $28, $44, $00
.byte $00, $38, $4c, $18, $30, $60, $7c, $00, $00, $38, $4c, $18, $30, $60, $7c, $00
.byte $00, $26, $69, $29, $29, $29, $26, $00, $00, $26, $69, $29, $29, $29, $26, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00, $00, $08, $08, $08, $08, $08, $08, $00
.byte $38, $4c, $c6, $c6, $c6, $64, $38, $00, $38, $4c, $c6, $c6, $c6, $64, $38, $00
.byte $18, $38, $18, $18, $18, $18, $7e, $00, $18, $38, $18, $18, $18, $18, $7e, $00
.byte $7c, $c6, $0e, $3c, $78, $e0, $fe, $00, $7c, $c6, $0e, $3c, $78, $e0, $fe, $00
.byte $7e, $0c, $18, $3c, $06, $c6, $7c, $00, $7e, $0c, $18, $3c, $06, $c6, $7c, $00
.byte $1c, $3c, $6c, $cc, $fe, $0c, $0c, $00, $1c, $3c, $6c, $cc, $fe, $0c, $0c, $00
.byte $fc, $c0, $fc, $06, $06, $c6, $7c, $00, $fc, $c0, $fc, $06, $06, $c6, $7c, $00
.byte $3c, $60, $c0, $fc, $c6, $c6, $7c, $00, $3c, $60, $c0, $fc, $c6, $c6, $7c, $00
.byte $fe, $c6, $0c, $18, $30, $30, $30, $00, $fe, $c6, $0c, $18, $30, $30, $30, $00
.byte $7c, $c6, $c6, $7c, $c6, $c6, $7c, $00, $7c, $c6, $c6, $7c, $c6, $c6, $7c, $00
.byte $7c, $c6, $c6, $7e, $06, $0c, $78, $00, $7c, $c6, $c6, $7e, $06, $0c, $78, $00
.byte $38, $6c, $c6, $c6, $fe, $c6, $c6, $00, $38, $6c, $c6, $c6, $fe, $c6, $c6, $00
.byte $fc, $c6, $c6, $fc, $c6, $c6, $fc, $00, $fc, $c6, $c6, $fc, $c6, $c6, $fc, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00, $04, $0c, $1c, $3c, $1c, $0c, $04, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00, $40, $60, $70, $78, $70, $60, $40, $00
.byte $00, $00, $00, $00, $00, $00, $ff, $00, $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $03, $02, $00, $00, $00, $00, $00, $00, $00, $00
.byte $02, $02, $02, $02, $02, $02, $02, $02, $00, $00, $00, $00, $00, $00, $00, $00
.byte $03, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00
.byte $fe, $c0, $c0, $fc, $c0, $c0, $fe, $00, $fe, $c0, $c0, $fc, $c0, $c0, $fe, $00
.byte $ff, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00
.byte $0f, $0f, $0f, $0f, $0f, $0f, $8f, $8f, $09, $09, $09, $09, $09, $09, $09, $09
.byte $60, $60, $60, $60, $60, $60, $7e, $00, $60, $60, $60, $60, $60, $60, $7e, $00
.byte $8f, $8f, $8f, $8f, $8f, $8f, $8f, $8f, $09, $09, $09, $09, $09, $09, $09, $09
.byte $c6, $e6, $f6, $fe, $de, $ce, $c6, $00, $c6, $e6, $f6, $fe, $de, $ce, $c6, $00
.byte $7c, $c6, $c6, $c6, $c6, $c6, $7c, $00, $7c, $c6, $c6, $c6, $c6, $c6, $7c, $00
.byte $fc, $c6, $c6, $c6, $fc, $c0, $c0, $00, $fc, $c6, $c6, $c6, $fc, $c0, $c0, $00
.byte $8f, $0f, $0f, $0f, $0f, $0f, $0f, $0f, $09, $09, $09, $09, $09, $09, $09, $09
.byte $fc, $c6, $c6, $ce, $f8, $dc, $ce, $00, $fc, $c6, $c6, $ce, $f8, $dc, $ce, $00
.byte $78, $cc, $c0, $7c, $06, $c6, $7c, $00, $78, $cc, $c0, $7c, $06, $c6, $7c, $00
.byte $7e, $18, $18, $18, $18, $18, $18, $00, $7e, $18, $18, $18, $18, $18, $18, $00
.byte $c6, $c6, $c6, $c6, $c6, $c6, $7c, $00, $c6, $c6, $c6, $c6, $c6, $c6, $7c, $00
.byte $ff, $ff, $ff, $ff, $ff, $ff, $ff, $ff, $81, $01, $01, $01, $01, $01, $01, $01
.byte $ff, $ff, $ff, $ff, $ff, $ff, $ff, $00, $00, $00, $00, $00, $00, $00, $ff, $00
.byte $ff, $ff, $ff, $ff, $ff, $ff, $ff, $ff, $ff, $00, $00, $00, $00, $00, $00, $00
.byte $3e, $60, $c0, $ce, $c6, $66, $3e, $00, $3e, $60, $c0, $ce, $c6, $66, $3e, $00
.byte $38, $7c, $9e, $be, $fe, $fe, $7c, $38, $38, $7c, $fe, $fe, $fe, $fe, $7c, $38
.byte $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00
.byte $3c, $78, $e0, $c0, $80, $00, $00, $00, $3c, $78, $e0, $c0, $80, $00, $00, $00
.byte $00, $00, $00, $c0, $e0, $60, $00, $00, $00, $00, $00, $c0, $e0, $60, $00, $00
.byte $00, $00, $00, $00, $00, $c0, $e0, $70, $00, $00, $00, $00, $00, $c0, $e0, $70
.byte $00, $01, $01, $01, $01, $01, $01, $01, $00, $01, $01, $01, $01, $01, $01, $01
.byte $80, $40, $40, $40, $40, $40, $40, $40, $80, $c0, $c0, $c0, $c0, $c0, $c0, $c0
.byte $3f, $7f, $7f, $7f, $7f, $7f, $7f, $7f, $3f, $60, $40, $40, $40, $40, $40, $4f
.byte $fc, $fe, $fe, $fe, $fe, $fe, $fe, $fe, $fc, $06, $02, $02, $02, $02, $02, $f2
.byte $7f, $7f, $7f, $7f, $7f, $7f, $7f, $7f, $4f, $49, $48, $48, $48, $49, $49, $4f
.byte $fe, $fe, $fe, $fe, $fe, $fe, $fe, $fe, $f2, $92, $92, $12, $12, $12, $92, $f2
.byte $7f, $7f, $7f, $7f, $7f, $7f, $7f, $3f, $4f, $40, $40, $40, $40, $40, $60, $3f
.byte $fe, $fe, $fe, $fe, $fe, $fe, $fe, $fc, $f2, $02, $02, $02, $02, $02, $06, $fc
.byte $0f, $0f, $0f, $0f, $0f, $0f, $0f, $0f, $09, $09, $09, $09, $09, $09, $09, $09
.byte $ff, $ff, $ff, $ff, $ff, $ff, $ff, $ff, $00, $00, $00, $00, $00, $00, $00, $00
.byte $ff, $ff, $ff, $ff, $ff, $ff, $ff, $fc, $00, $00, $00, $00, $00, $01, $07, $0c
.byte $ff, $ff, $ff, $fc, $f0, $c0, $00, $00, $00, $01, $07, $1c, $70, $c0, $00, $00
.byte $ff, $e0, $00, $00, $00, $00, $00, $00, $3f, $e0, $00, $00, $00, $00, $00, $00
.byte $ff, $00, $00, $00, $00, $00, $00, $00, $ff, $00, $00, $00, $00, $00, $00, $00
.byte $ff, $0f, $01, $00, $00, $00, $00, $00, $f8, $0f, $01, $00, $00, $00, $00, $00
.byte $ff, $ff, $ff, $3f, $0f, $03, $00, $00, $00, $00, $e0, $38, $0e, $03, $00, $00
.byte $ff, $ff, $ff, $ff, $ff, $ff, $ff, $3f, $00, $00, $00, $00, $00, $80, $e0, $30
.byte $ff, $ff, $ff, $ff, $ff, $fe, $fc, $f8, $00, $00, $00, $01, $03, $06, $0c, $18
.byte $f8, $e0, $c0, $80, $00, $00, $00, $00, $38, $60, $c0, $80, $00, $00, $00, $00
.byte $1f, $07, $03, $01, $00, $00, $00, $00, $1c, $06, $03, $01, $00, $00, $00, $00
.byte $ff, $ff, $ff, $ff, $ff, $7f, $3f, $1f, $00, $00, $00, $80, $c0, $60, $30, $18
.byte $ff, $ff, $ff, $ff, $ff, $ff, $ff, $ff, $00, $00, $00, $00, $00, $01, $01, $03
.byte $f0, $f0, $e0, $c0, $c0, $80, $00, $00, $10, $30, $60, $40, $c0, $80, $00, $00
.byte $00, $00, $00, $03, $0f, $3f, $7f, $ff, $00, $00, $00, $03, $0e, $38, $60, $c0
.byte $00, $00, $e0, $f0, $f8, $fc, $fe, $ff, $00, $00, $e0, $b0, $18, $0c, $06, $03
.byte $00, $00, $00, $00, $00, $00, $00, $00, $00, $0f, $07, $03, $01, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00, $00, $f8, $f0, $e0, $c0, $80, $00, $00
.byte $01, $03, $07, $0f, $1f, $3f, $7f, $ff, $01, $03, $06, $0c, $18, $30, $60, $c0
.byte $ff, $ff, $ff, $ff, $ff, $ff, $ff, $ff, $ff, $00, $00, $00, $00, $00, $00, $00
.byte $e0, $fc, $ff, $ff, $ff, $ff, $ff, $ff, $e0, $3c, $07, $01, $00, $00, $00, $00
.byte $00, $00, $00, $c0, $f0, $fc, $fe, $ff, $00, $00, $00, $c0, $70, $1c, $06, $03
.byte $0f, $0f, $07, $03, $03, $01, $00, $00, $08, $0c, $06, $02, $03, $01, $00, $00
.byte $ff, $ff, $ff, $ff, $ff, $ff, $ff, $ff, $00, $00, $00, $00, $00, $80, $80, $c0
.byte $f0, $f0, $f0, $f0, $f0, $f0, $f0, $f0, $90, $90, $90, $90, $90, $90, $90, $90
.byte $fe, $fe, $fc, $fc, $f8, $f8, $f0, $f0, $02, $06, $04, $0c, $08, $18, $10, $10
.byte $01, $01, $03, $07, $07, $0f, $0f, $1f, $01, $01, $03, $06, $04, $0c, $08, $18
.byte $ff, $ff, $ff, $ff, $ff, $ff, $ff, $ff, $80, $00, $00, $00, $00, $00, $00, $00
.byte $ff, $ff, $ff, $ff, $ff, $ff, $ff, $ff, $01, $00, $00, $00, $00, $00, $00, $00
.byte $80, $c0, $e0, $f0, $f8, $fc, $fe, $ff, $80, $c0, $60, $30, $18, $0c, $06, $03
.byte $00, $00, $00, $00, $18, $3c, $7e, $ff, $00, $00, $00, $00, $18, $3c, $66, $c3
.byte $80, $80, $c0, $e0, $e0, $f0, $f8, $f8, $80, $80, $c0, $60, $20, $30, $18, $08
.byte $7f, $7f, $3f, $3f, $1f, $1f, $0f, $0f, $40, $60, $20, $30, $10, $18, $08, $0c
.byte $f0, $e0, $e0, $e0, $c0, $c0, $c0, $c0, $30, $20, $20, $60, $40, $40, $40, $c0
.byte $1f, $3f, $3f, $7f, $7f, $7f, $ff, $ff, $10, $30, $20, $60, $40, $40, $c0, $80
.byte $80, $80, $80, $80, $80, $80, $80, $80, $80, $80, $80, $80, $80, $80, $80, $80
.byte $ff, $ff, $ff, $ff, $ff, $ff, $ff, $ff, $00, $00, $00, $00, $00, $00, $00, $01
.byte $00, $00, $00, $00, $00, $03, $0f, $1f, $00, $00, $00, $07, $1f, $3f, $7f, $7f
.byte $00, $00, $00, $00, $00, $c0, $f0, $f8, $00, $00, $00, $e0, $f8, $fc, $fe, $fe
.byte $01, $01, $01, $01, $01, $01, $01, $01, $01, $01, $01, $01, $01, $01, $01, $01
.byte $fc, $fc, $fe, $fe, $fe, $ff, $ff, $ff, $0c, $04, $06, $02, $02, $03, $01, $01
.byte $07, $07, $07, $03, $03, $03, $03, $01, $04, $04, $06, $02, $02, $02, $03, $01
.byte $ff, $ff, $ff, $ff, $ff, $ff, $ff, $ff, $80, $80, $80, $80, $80, $80, $80, $80
.byte $1f, $36, $25, $35, $35, $35, $36, $1f, $ff, $f6, $e5, $f5, $f5, $f5, $f6, $ff
.byte $f8, $ec, $54, $54, $54, $54, $ec, $f8, $ff, $ef, $57, $57, $57, $57, $ef, $ff
.byte $ff, $ff, $ff, $ff, $e0, $e0, $e0, $e0, $00, $00, $00, $00, $00, $00, $00, $00
.byte $ff, $ff, $ff, $ff, $03, $03, $03, $03, $00, $00, $00, $00, $00, $00, $00, $00
.byte $ff, $ff, $ff, $ff, $ff, $ff, $ff, $ff, $00, $00, $00, $00, $00, $00, $00, $ff
.byte $ff, $ff, $ff, $fc, $f0, $e0, $c0, $80, $00, $01, $07, $1c, $30, $60, $c0, $80
.byte $e0, $e0, $e0, $e0, $e0, $e0, $e0, $e0, $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $03, $03, $03, $03, $03, $03, $03, $00, $00, $00, $00, $00, $00, $00, $00
.byte $ff, $ff, $ff, $3f, $0f, $07, $03, $01, $00, $00, $e0, $38, $0c, $06, $03, $01
.byte $ff, $ff, $ff, $ff, $ff, $ff, $ff, $ff, $01, $00, $00, $00, $00, $00, $00, $80
.byte $80, $80, $80, $c0, $c0, $c0, $c0, $e0, $80, $80, $80, $c0, $40, $40, $40, $60
.byte $01, $01, $01, $01, $01, $00, $00, $00, $01, $01, $01, $01, $01, $00, $00, $00
.byte $00, $ee, $aa, $aa, $aa, $aa, $ee, $00, $00, $ee, $aa, $aa, $aa, $aa, $ee, $00
.byte $ff, $fe, $fc, $f8, $f0, $e0, $c0, $80, $03, $06, $0c, $18, $30, $60, $c0, $80
.byte $00, $00, $07, $08, $10, $10, $20, $20, $00, $00, $07, $0f, $1f, $1f, $3f, $3f
.byte $00, $00, $e0, $10, $08, $08, $04, $04, $00, $00, $e0, $f0, $f8, $f8, $fc, $fc
.byte $ff, $ff, $7f, $7f, $3f, $3f, $1f, $1f, $80, $c0, $40, $60, $20, $30, $10, $18
.byte $e0, $e0, $e0, $e0, $e0, $e0, $e0, $e0, $20, $20, $20, $20, $20, $20, $20, $20
.byte $80, $80, $80, $c0, $c0, $c0, $e0, $e0, $80, $80, $80, $c0, $40, $40, $60, $20
.byte $ff, $ff, $ff, $7f, $7f, $7f, $3f, $3f, $80, $80, $c0, $40, $40, $60, $20, $20
.byte $20, $20, $10, $10, $08, $07, $00, $00, $3f, $3f, $1f, $1f, $0f, $07, $00, $00
.byte $04, $04, $08, $08, $10, $e0, $00, $00, $fc, $fc, $f8, $f8, $f0, $e0, $00, $00
.byte $00, $0e, $08, $0e, $02, $02, $0e, $00, $00, $0e, $08, $0e, $02, $02, $0e, $00
.byte $00, $2e, $6a, $2a, $2a, $2a, $2e, $00, $00, $2e, $6a, $2a, $2a, $2a, $2e, $00
.byte $0f, $0f, $0f, $0f, $07, $07, $07, $07, $08, $08, $08, $0c, $04, $04, $04, $04
.byte $e0, $e0, $e0, $e0, $e0, $e0, $e0, $e0, $20, $20, $20, $20, $20, $20, $20, $20
.byte $e0, $f0, $f0, $f0, $f8, $f8, $f8, $fc, $20, $30, $10, $10, $18, $08, $08, $0c
.byte $3f, $1f, $1f, $1f, $0f, $0f, $0f, $07, $30, $10, $10, $18, $08, $08, $0c, $04
.byte $ff, $ff, $ff, $ff, $ff, $ff, $ff, $ff, $01, $01, $01, $01, $01, $01, $01, $01
.byte $ff, $7f, $3f, $1f, $0f, $07, $03, $01, $c0, $60, $30, $18, $0c, $06, $03, $01
.byte $01, $03, $07, $0f, $1f, $3f, $7f, $ff, $01, $03, $07, $0d, $19, $31, $61, $c1
.byte $07, $07, $07, $07, $07, $07, $07, $07, $04, $04, $04, $04, $04, $04, $04, $04
.byte $fc, $fc, $fe, $fe, $fe, $ff, $ff, $ff, $04, $04, $06, $02, $02, $03, $01, $01
.byte $07, $03, $03, $01, $01, $00, $00, $00, $06, $02, $03, $01, $01, $00, $00, $00
.byte $ff, $ff, $ff, $ff, $ff, $fe, $fe, $7c, $01, $01, $01, $01, $83, $82, $c6, $7c
.byte $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $01, $01, $03, $03
.byte $00, $00, $00, $00, $03, $0f, $1f, $3f, $0f, $3f, $7f, $ff, $ff, $ff, $ff, $ff
.byte $00, $00, $00, $00, $c0, $f0, $f8, $fc, $f0, $fc, $fe, $ff, $ff, $ff, $ff, $ff
.byte $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $80, $80, $c0, $c0
.byte $00, $00, $00, $00, $00, $00, $00, $00, $03, $07, $07, $07, $07, $07, $07, $03
.byte $3f, $76, $65, $75, $75, $75, $76, $3f, $ff, $f6, $e5, $f5, $f5, $f5, $f6, $ff
.byte $fc, $ee, $56, $56, $56, $56, $ee, $fc, $ff, $ef, $57, $57, $57, $57, $ef, $ff
.byte $00, $00, $00, $00, $00, $00, $00, $00, $c0, $e0, $e0, $e0, $e0, $e0, $e0, $c0
.byte $00, $00, $00, $00, $00, $00, $00, $00, $03, $03, $01, $01, $00, $00, $00, $00
.byte $3f, $1f, $0f, $03, $00, $00, $00, $00, $ff, $ff, $ff, $ff, $ff, $7f, $3f, $0f
.byte $fc, $f8, $f0, $c0, $00, $00, $00, $00, $ff, $ff, $ff, $ff, $ff, $fe, $fc, $f0
.byte $00, $00, $00, $00, $00, $00, $00, $00, $c0, $c0, $80, $80, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00, $60, $60, $60, $60, $60, $60, $60, $00
.byte $07, $07, $07, $0f, $0f, $0f, $1f, $1f, $04, $04, $04, $0c, $08, $08, $18, $10
.byte $00, $00, $00, $00, $00, $01, $03, $07, $00, $00, $00, $00, $00, $01, $03, $06
.byte $1f, $3f, $3f, $7f, $ff, $ff, $ff, $ff, $10, $30, $20, $60, $c0, $80, $00, $00
.byte $0f, $3f, $ff, $ff, $ff, $ff, $ff, $ff, $0c, $38, $e0, $80, $80, $80, $80, $80
.byte $00, $00, $00, $03, $07, $06, $00, $00, $00, $00, $00, $03, $07, $06, $00, $00
.byte $ff, $ff, $ff, $ff, $ff, $ff, $ff, $ff, $00, $00, $00, $00, $00, $00, $00, $80
.byte $ff, $7f, $3f, $1f, $0f, $07, $03, $03, $c0, $60, $30, $18, $0c, $06, $02, $03
.byte $00, $00, $00, $00, $00, $00, $00, $00, $18, $18, $1c, $1e, $1b, $19, $18, $18
.byte $00, $00, $00, $00, $00, $00, $00, $00, $d8, $d8, $c0, $da, $db, $db, $db, $db
.byte $00, $00, $00, $00, $00, $00, $00, $00, $00, $0c, $1e, $cc, $6d, $6d, $6d, $6c
.byte $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $e5, $b6, $f6, $86, $e6
.byte $00, $00, $00, $00, $00, $00, $00, $00, $03, $03, $03, $8f, $db, $db, $db, $cf
.byte $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $38, $6c, $6c, $6c, $38
.byte $01, $01, $01, $01, $01, $01, $01, $03, $01, $01, $01, $01, $01, $01, $01, $03
.byte $01, $03, $07, $07, $07, $07, $07, $07, $01, $03, $06, $04, $04, $04, $04, $04
.byte $ff, $ff, $ff, $ff, $ff, $ff, $ff, $ff, $81, $00, $00, $00, $00, $00, $00, $00
.byte $80, $c0, $e0, $f8, $ff, $ff, $ff, $ff, $80, $c0, $60, $38, $0f, $00, $00, $00
.byte $03, $07, $0f, $3f, $ff, $ff, $ff, $ff, $02, $06, $0c, $38, $e0, $00, $00, $00
.byte $01, $01, $00, $00, $00, $00, $00, $00, $01, $01, $00, $00, $00, $00, $00, $00
.byte $40, $40, $80, $00, $00, $00, $00, $00, $c0, $c0, $80, $00, $00, $00, $00, $00
.byte $07, $07, $07, $07, $07, $07, $07, $07, $04, $04, $04, $04, $04, $04, $04, $04
.byte $ff, $ff, $fe, $fe, $fc, $fc, $f8, $f8, $01, $03, $02, $06, $04, $0c, $08, $18
.byte $1f, $0f, $03, $00, $00, $00, $00, $00, $7f, $7f, $3f, $1f, $07, $00, $00, $00
.byte $f8, $f0, $c0, $00, $00, $00, $00, $00, $fe, $fe, $fc, $f8, $e0, $00, $00, $00
.byte $0f, $0f, $07, $07, $03, $03, $01, $01, $08, $0c, $04, $06, $02, $03, $01, $01
.byte $ff, $ff, $ff, $ff, $ff, $ff, $ff, $ff, $00, $00, $00, $00, $00, $00, $00, $f8
.byte $3f, $7f, $5b, $55, $55, $55, $5b, $7f, $3f, $7f, $5b, $55, $55, $55, $5b, $7f
.byte $fc, $fe, $fe, $fe, $fe, $fe, $fe, $fe, $fc, $fe, $fe, $fe, $fe, $fe, $fe, $fe
.byte $3f, $7f, $63, $77, $77, $57, $67, $7f, $3f, $7f, $63, $77, $77, $57, $67, $7f
.byte $3f, $7f, $67, $5b, $5b, $57, $63, $7f, $3f, $7f, $67, $5b, $5b, $57, $63, $7f
.byte $3f, $7f, $5b, $57, $4f, $57, $5b, $7f, $3f, $7f, $5b, $57, $4f, $57, $5b, $7f
.byte $3f, $7f, $67, $5b, $5b, $43, $5b, $7f, $3f, $7f, $67, $5b, $5b, $43, $5b, $7f
.byte $7f, $7f, $7e, $7c, $7c, $7f, $7e, $7f, $7f, $7f, $7e, $7c, $7c, $7f, $7e, $7f
.byte $fe, $7e, $3e, $1e, $9e, $7e, $3e, $fe, $fe, $7e, $3e, $1e, $9e, $7e, $3e, $fe
.byte $0f, $07, $03, $03, $01, $01, $01, $01, $0c, $06, $02, $03, $01, $01, $01, $01
.byte $01, $01, $01, $03, $03, $07, $07, $0f, $01, $01, $01, $03, $02, $06, $04, $0c
.byte $7f, $7f, $7f, $7f, $7f, $7f, $7f, $3f, $7f, $7f, $7f, $7f, $7f, $7f, $7f, $3f
.byte $fe, $da, $aa, $aa, $aa, $da, $fe, $fc, $fe, $da, $aa, $aa, $aa, $da, $fe, $fc
.byte $fe, $e6, $ea, $ee, $ee, $c6, $fe, $fc, $fe, $e6, $ea, $ee, $ee, $c6, $fe, $fc
.byte $fe, $c6, $ea, $da, $da, $e6, $fe, $fc, $fe, $c6, $ea, $da, $da, $e6, $fe, $fc
.byte $fe, $da, $ea, $f2, $ea, $da, $fe, $fc, $fe, $da, $ea, $f2, $ea, $da, $fe, $fc
.byte $fe, $da, $c2, $da, $da, $e6, $fe, $fc, $fe, $da, $c2, $da, $da, $e6, $fe, $fc
.byte $0f, $1f, $1f, $3f, $3f, $7f, $7f, $ff, $08, $18, $10, $30, $20, $60, $40, $c0
.byte $00, $ff, $c5, $dd, $c6, $dd, $c5, $ff, $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $ff, $51, $5b, $db, $5b, $5b, $ff, $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $80, $c0, $e0, $c0, $80, $00, $00, $00, $00, $00, $00, $00, $00, $00
.byte $03, $03, $03, $03, $03, $03, $03, $03, $03, $03, $03, $03, $03, $03, $03, $03
.byte $02, $07, $05, $05, $04, $04, $04, $04, $02, $07, $07, $07, $07, $07, $07, $07
.byte $00, $00, $00, $01, $01, $01, $03, $02, $00, $00, $00, $01, $01, $01, $03, $03
.byte $c0, $c0, $c0, $c0, $c0, $c0, $c0, $c0, $c0, $c0, $c0, $c0, $c0, $c0, $c0, $c0
.byte $00, $00, $00, $80, $80, $80, $c0, $40, $00, $00, $00, $80, $80, $80, $c0, $c0
.byte $04, $04, $04, $04, $04, $04, $04, $04, $07, $07, $07, $07, $07, $07, $07, $07
.byte $02, $06, $04, $04, $0c, $08, $08, $18, $03, $07, $07, $07, $0f, $0f, $0f, $1f
.byte $40, $e0, $a0, $a0, $20, $20, $20, $20, $40, $e0, $e0, $e0, $e0, $e0, $e0, $e0
.byte $40, $60, $20, $20, $30, $10, $10, $18, $c0, $e0, $e0, $e0, $f0, $f0, $f0, $f8
.byte $04, $04, $04, $04, $06, $02, $03, $01, $07, $07, $07, $07, $07, $03, $03, $01
.byte $20, $20, $20, $20, $20, $20, $20, $20, $e0, $e0, $e0, $e0, $e0, $e0, $e0, $e0
.byte $10, $10, $30, $20, $20, $60, $40, $41, $1f, $1f, $3f, $3f, $3f, $7f, $7f, $7f
.byte $ff, $ff, $ff, $ff, $e6, $e3, $e0, $e0, $00, $00, $00, $00, $06, $03, $00, $00
.byte $ff, $ff, $ff, $ff, $03, $83, $c3, $73, $00, $00, $00, $00, $00, $80, $c0, $70
.byte $03, $03, $03, $03, $03, $01, $01, $00, $03, $03, $03, $03, $03, $01, $01, $00
.byte $08, $08, $0c, $04, $04, $06, $02, $82, $f8, $f8, $fc, $fc, $fc, $fe, $fe, $fe
.byte $c3, $71, $1b, $0e, $00, $00, $00, $00, $ff, $7f, $1f, $0e, $00, $00, $00, $00
.byte $20, $20, $20, $20, $60, $40, $c0, $80, $e0, $e0, $e0, $e0, $e0, $c0, $c0, $80
.byte $c3, $8e, $d8, $70, $00, $00, $00, $00, $ff, $fe, $f8, $70, $00, $00, $00, $00
.byte $c0, $c0, $c0, $c0, $c0, $80, $80, $00, $c0, $c0, $c0, $c0, $c0, $80, $80, $00
.byte $e0, $e0, $e0, $e0, $e6, $e3, $e0, $e0, $00, $00, $03, $0e, $06, $03, $00, $00
.byte $00, $03, $03, $03, $03, $83, $c3, $73, $38, $e0, $80, $00, $00, $80, $c0, $70
.byte $00, $00, $00, $00, $80, $80, $c0, $c0, $00, $00, $00, $00, $80, $80, $c0, $c0
.byte $e0, $70, $3c, $1e, $07, $03, $01, $00, $e0, $70, $3c, $1e, $07, $03, $01, $00
.byte $07, $0e, $3c, $78, $e0, $c0, $80, $00, $07, $0e, $3c, $78, $e0, $c0, $80, $00
.byte $00, $00, $00, $00, $01, $01, $03, $03, $00, $00, $00, $00, $01, $01, $03, $03
.byte $3c, $1e, $07, $03, $01, $00, $00, $00, $3c, $1e, $07, $03, $01, $00, $00, $00
.byte $00, $00, $00, $00, $00, $03, $07, $0e, $00, $00, $00, $00, $00, $03, $07, $0e
.byte $3f, $60, $c0, $80, $80, $80, $80, $c0, $3f, $7f, $ff, $ff, $ff, $ff, $ff, $ff
.byte $61, $3f, $00, $00, $00, $00, $00, $00, $7f, $3f, $00, $00, $00, $00, $00, $00
.byte $ff, $fd, $fd, $ff, $ff, $fd, $fd, $ff, $07, $05, $05, $07, $07, $05, $05, $07
.byte $ff, $99, $ff, $00, $00, $00, $00, $00, $ff, $99, $ff, $00, $00, $00, $00, $00
.byte $ff, $bf, $bf, $ff, $ff, $bf, $bf, $ff, $e0, $a0, $a0, $e0, $e0, $a0, $a0, $e0
.byte $00, $00, $00, $00, $00, $ff, $99, $ff, $00, $00, $00, $00, $00, $ff, $99, $ff
.byte $f0, $f0, $e0, $e0, $c0, $c0, $80, $80, $10, $30, $20, $60, $40, $c0, $80, $80
.byte $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $03, $07, $0f, $0e, $1f, $1f
.byte $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $e0, $f0, $38, $38, $3c, $3c
.byte $00, $00, $00, $00, $00, $00, $00, $00, $1f, $0f, $0f, $07, $03, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00, $3c, $38, $38, $f0, $e0, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $03, $07, $0e, $0c, $1f, $1f
.byte $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $e0, $f0, $38, $98, $9c, $3c
.byte $00, $00, $00, $00, $00, $00, $00, $00, $1e, $0c, $0c, $07, $03, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00, $7c, $18, $18, $f0, $e0, $00, $00, $00
.byte $80, $80, $c0, $c0, $e0, $e0, $f0, $f0, $80, $80, $c0, $40, $60, $20, $30, $10
.byte $3e, $63, $c0, $80, $80, $80, $80, $c0, $3e, $7f, $ff, $ff, $ff, $ff, $ff, $ff
.byte $60, $38, $0f, $01, $00, $00, $00, $00, $7f, $3f, $0f, $01, $00, $00, $00, $00
.byte $01, $01, $03, $03, $07, $07, $0f, $0f, $01, $01, $03, $02, $06, $04, $0c, $08
.byte $f8, $f8, $fc, $fc, $fe, $fe, $ff, $ff, $18, $08, $0c, $04, $06, $02, $03, $01
.byte $f8, $f8, $fc, $fc, $fe, $fe, $ff, $ff, $18, $08, $0c, $04, $06, $02, $03, $ff
.byte $1f, $1f, $3f, $3f, $7f, $7f, $ff, $ff, $18, $10, $30, $20, $60, $40, $c0, $ff
.byte $1f, $1f, $3f, $3f, $7f, $7f, $ff, $ff, $18, $10, $30, $20, $60, $40, $c0, $80
.byte $00, $7f, $3f, $1f, $07, $03, $01, $ff, $ff, $fe, $fc, $f8, $e0, $c0, $80, $00
.byte $66, $66, $66, $3c, $18, $18, $18, $00, $66, $66, $66, $3c, $18, $18, $18, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00, $1d, $0c, $0f, $07, $03, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00, $3c, $18, $38, $f0, $e0, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00, $1f, $0c, $0e, $07, $03, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00, $9c, $98, $38, $f0, $e0, $00, $00, $00
.byte $00, $00, $01, $03, $07, $03, $01, $00, $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $03, $07, $0f, $0e, $1d, $1d
.byte $92, $54, $38, $fe, $38, $54, $92, $00, $00, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $01, $0f, $38, $00, $00, $00, $00, $00, $01, $0f, $3f
.byte $60, $c0, $80, $80, $80, $80, $c0, $63, $7f, $ff, $ff, $ff, $ff, $ff, $ff, $7f
.byte $3e, $00, $00, $00, $00, $00, $00, $00, $3e, $00, $00, $00, $00, $00, $00, $00
.byte $00, $00, $00, $00, $00, $80, $f0, $1c, $00, $00, $00, $00, $00, $80, $f0, $fc
.byte $06, $03, $01, $01, $01, $01, $03, $c6, $fe, $ff, $ff, $ff, $ff, $ff, $ff, $fe
.byte $7c, $00, $00, $00, $00, $00, $00, $00, $7c, $00, $00, $00, $00, $00, $00, $00
.byte $fc, $06, $03, $01, $01, $01, $01, $03, $fc, $fe, $ff, $ff, $ff, $ff, $ff, $ff
.byte $86, $fc, $00, $00, $00, $00, $00, $00, $fe, $fc, $00, $00, $00, $00, $00, $00
.byte $7c, $c6, $03, $01, $01, $01, $01, $03, $7c, $fe, $ff, $ff, $ff, $ff, $ff, $ff
.byte $06, $1c, $f0, $80, $00, $00, $00, $00, $fe, $fc, $f0, $80

.segment "VECTORS"

.addr NMI, Reset, NMI
