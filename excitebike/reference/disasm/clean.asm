.segment "BANK_FF"
.include "bank_ram.inc"
.include "bank_val.inc"
.org $C000  ; for listing file
; 0x000010-0x00400F
; остановился на 0x000144, разобрать таблицы и добавить пробелы между строками
tbl_C000:
C000  .word ofs_000_C346_00
C002  .word ofs_000_C395_01
C004  .word ofs_000_C99A_02
C006  .word ofs_000_CB2C_03
C008  .word ofs_000_C465_04
C00A  .word ofs_000_C99A_05
C00C  .word ofs_000_CB2C_06
C00E  .word ofs_000_C465_07
C010  .word ofs_000_C3BD_08
C012  .word ofs_000_C97C_09
C014  .word ofs_000_C99A_0A
C016  .word ofs_000_CB2C_0B
C018  .word ofs_000_C43D_0C
C01A  .word ofs_000_C41C_0D
tbl_C01C:
C01C  .byte $00   ; 00 
C01D  .byte $01   ; 01 
C01E  .byte $02   ; 02 
C01F  .byte $03   ; 03 
C020  .byte $04   ; 04 
C021  .byte $02   ; 05 
C022  .byte $03   ; 06 
C023  .byte $04   ; 07 
C024  .byte $06   ; 08 
C025  .byte $05   ; 09 
C026  .byte $02   ; 0A 
C027  .byte $03   ; 0B 
C028  .byte $07   ; 0C 
C029  .byte $08   ; 0D 
tbl_C02A_lo:
C02A  .byte < off_C03C_00   ; 
C02B  .byte < off_C040_01   ; 
C02C  .byte < off_C046_02   ; 
C02D  .byte < off_C052_03   ; 
C02E  .byte < off_C05C_04   ; 
C02F  .byte < off_C064_05   ; 
C030  .byte < off_C070_06   ; 
C031  .byte < off_C07A_07   ; 
C032  .byte < off_C076_08   ; 
tbl_C033_hi:
C033  .byte > off_C03C_00   ; 
C034  .byte > off_C040_01   ; 
C035  .byte > off_C046_02   ; 
C036  .byte > off_C052_03   ; 
C037  .byte > off_C05C_04   ; 
C038  .byte > off_C064_05   ; 
C039  .byte > off_C070_06   ; 
C03A  .byte > off_C07A_07   ; 
C03B  .byte > off_C076_08   ; 
off_C03C_00:
C03C  .word ofs_001_C2BD_00_01
C03E  .word ofs_001_C514_00_02
off_C040_01:
C040  .word ofs_001_C55E_01_01
C042  .word ofs_001_C3F3_01_02
C044  .word ofs_001_C514_01_03
off_C046_02:
C046  .word ofs_001_C551_02_01
C048  .word ofs_001_C869_02_02
C04A  .word ofs_001_C820_02_03
C04C  .word ofs_001_C5A3_02_04
C04E  .word ofs_001_C566_02_05
C050  .word ofs_001_C875_02_06
off_C052_03:
C052  .word ofs_001_C55E_03_01
C054  .word ofs_001_C56A_03_02
C056  .word ofs_001_C455_03_03
C058  .word ofs_001_C5A7_03_04
C05A  .word ofs_001_C485_03_05
off_C05C_04:
C05C  .word ofs_001_C55E_04_01
C05E  .word ofs_001_C571_04_02
C060  .word ofs_001_C5AC_04_03
C062  .word ofs_001_C514_04_04
off_C064_05:
C064  .word ofs_001_C551_05_01
C066  .word ofs_001_C869_05_02
C068  .word ofs_001_C820_05_03
C06A  .word ofs_001_C5A3_05_04
C06C  .word ofs_001_C562_05_05
C06E  .word ofs_001_C5C2_05_06
off_C070_06:
C070  .word ofs_001_C55E_06_01
C072  .word ofs_001_C575_06_02
C074  .word ofs_001_C514_06_03
off_C076_08:
C076  .word ofs_001_C582_08_01
C078  .word ofs_001_C518_08_02
off_C07A_07:
C07A  .word ofs_001_C869_07_01
C07C  .word ofs_001_C586_07_02
C07E  .word ofs_001_C518_07_03
tbl_C080:
C080  .byte $80   ; 00 
C081  .byte $90   ; 01 
C082  .byte $A0   ; 02 
tbl_C083:
C083  .byte $48   ; 00 
C084  .byte $60   ; 01 
C085  .byte $78   ; 02 
C086  .byte $90   ; 03 
C087  .byte $A8   ; 04 
tbl_C088:
C088  .byte $50   ; 00 
C089  .byte $48   ; 01 
C08A  .byte $4C   ; 02 
tbl_C08B:
C08B  .byte $30   ; 00 
C08C  .byte $48   ; 01 
C08D  .byte $78   ; 02 
C08E  .byte $90   ; 03 
C08F  .byte $A8   ; 04 
C090  .byte $C0   ; 05 
tbl_C091:
C091  .byte $01, $10, $00   ; 00 
C094  .byte $01, $10, $00   ; 01 
C097  .byte $01, $10, $00   ; 02 
C09A  .byte $01, $0C, $00   ; 03 
C09D  .byte $01, $06, $00   ; 04 
C0A0  .byte $00, $01, $18   ; 05 
C0A3  .byte $00, $01, $16   ; 06 
C0A6  .byte $00, $01, $0A   ; 07 
C0A9  .byte $00, $01, $14   ; 08 
C0AC  .byte $00, $01, $06   ; 09 
C0AF  .byte $00   ; 0A
; bzk bug? sharing 2 bytes with 0x0000C0
tbl_C0B0:
C0B0  .byte $09   ; 00 
C0B1  .byte $0B   ; 01 
C0B2  .byte $0D   ; 02 
C0B3  .byte $0F   ; 03 
tbl_C0B4:
C0B4  .byte $0E   ; 00 
C0B5  .byte $1A   ; 01 
C0B6  .byte $26   ; 02 
C0B7  .byte $32   ; 03 
tbl_C0B8:
C0B8  .byte $38   ; 00 
C0B9  .byte $48   ; 01 
C0BA  .byte $58   ; 02 
C0BB  .byte $68   ; 03 
tbl_C0BC:
C0BC  .byte $18   ; 00 
C0BD  .byte $3F   ; 01 
C0BE  .byte $28   ; 02 
C0BF  .byte $20   ; 03 
C0C0  .byte $28   ; 04 
tbl_C0C1:
C0C1  .byte $38   ; 00 
C0C2  .byte $0C   ; 01 
C0C3  .byte $00   ; 02 
C0C4  .byte $3C   ; 03 
C0C5  .byte $1C   ; 04 
C0C6  .byte $C0   ; 05 
C0C7  .byte $7F   ; 06 
tbl_C0C8:
C0C8  .byte $06   ; 00 
C0C9  .byte $02   ; 02 
tbl_C0CA:
C0CA  .byte $0A   ; 00 
C0CB  .byte $0B   ; 02 
tbl_C0CC:
C0CC  .byte $01   ; 00 
C0CD  .byte $B0   ; 02 
tbl_C0CE:
C0CE  .byte $20   ; 00 
C0CF  .byte $40   ; 01 
C0D0  .byte $7F   ; 02 
tbl_C0D1:
C0D1  .byte $03   ; 00 
C0D2  .byte $03   ; 01 
C0D3  .byte $01   ; 02 
tbl_C0D4:
C0D4  .byte $06   ; 00 
C0D5  .byte $04   ; 02 
tbl_C0D6:
; 00 
C0D6  .byte $40   ; 
C0D7  .byte $58   ; 
; 02 
C0D8  .byte $48   ; 
C0D9  .byte $48   ; 
tbl_C0DA:
C0DA  .byte $78   ; 00 
C0DB  .byte $70   ; 01 
C0DC  .byte $80   ; 02 
C0DD  .byte $B0   ; 03 
tbl_C0DE:
C0DE  .byte $37   ; 00 
C0DF  .byte $3F   ; 01 
C0E0  .byte $3F   ; 02 
C0E1  .byte $47   ; 03 
tbl_C0E2:
C0E2  .byte $B7   ; 00 
C0E3  .byte $B9   ; 01 
C0E4  .byte $B9   ; 02 
tbl_C0E5:
C0E5  .byte $01   ; 00 
C0E6  .byte $01   ; 01 
C0E7  .byte $41   ; 02 
tbl_C0E8:
C0E8  .byte $04   ; 00 
C0E9  .byte $0C   ; 01 
C0EA  .byte $14   ; 02 
C0EB  .byte $1C   ; 03 
tbl_C0EC:
C0EC  .dbyt $21F2 ; 00
C0EE  .dbyt $2343 ; 02
C0F0  .dbyt $2232 ; 04
C0F2  .dbyt $228C ; 06
C0F4  .dbyt $24CF ; 08
tbl_C0F6_lo:
C0F6  .byte < ram_0301   ;  00
C0F7  .byte < _off_000_D470_01   ; 
C0F8  .byte < _off_000_D64B_02   ; 
C0F9  .byte < _off_000_D6D4_03   ; 
C0FA  .byte < _off_000_D717_04   ; 
C0FB  .byte < _off_000_D84A_05   ; 
C0FC  .byte < _off_000_D63A_06   ; 
C0FD  .byte < _off_000_D59E_07   ; 
C0FE  .byte < _off_000_D5B4_08   ; 
C0FF  .byte < _off_000_D796_09   ; 
C100  .byte < _off_000_D5C8_0A   ; 
C101  .byte < _off_000_D5DE_0B   ; 
C102  .byte < _off_000_D5EF_0C   ; 
C103  .byte < _off_000_D605_0D   ; 
C104  .byte < _off_000_D524_0E   ; 
C105  .byte < _off_000_D7FA_0F   ; 
C106  .byte < _off_000_D623_10   ; 
C107  .byte < _off_000_D614_11   ; 
C108  .byte < _off_000_D3D6_12   ; 
C109  .byte < _off_000_D3E9_13   ; 
C10A  .byte < _off_000_D3FC_14   ; 
C10B  .byte < _off_000_D40F_15   ; 
C10C  .byte < _off_000_D422_16   ; 
C10D  .byte < _off_000_D435_17   ; 
C10E  .byte < _off_000_D450_18   ; 
C10F  .byte < _off_000_D631_19   ; 
C110  .byte < ram_00A1   ;  1A
tbl_C111_hi:
C111  .byte > ram_0301   ;  00
C112  .byte > _off_000_D470_01   ; 
C113  .byte > _off_000_D64B_02   ; 
C114  .byte > _off_000_D6D4_03   ; 
C115  .byte > _off_000_D717_04   ; 
C116  .byte > _off_000_D84A_05   ; 
C117  .byte > _off_000_D63A_06   ; 
C118  .byte > _off_000_D59E_07   ; 
C119  .byte > _off_000_D5B4_08   ; 
C11A  .byte > _off_000_D796_09   ; 
C11B  .byte > _off_000_D5C8_0A   ; 
C11C  .byte > _off_000_D5DE_0B   ; 
C11D  .byte > _off_000_D5EF_0C   ; 
C11E  .byte > _off_000_D605_0D   ; 
C11F  .byte > _off_000_D524_0E   ; 
C120  .byte > _off_000_D7FA_0F   ; 
C121  .byte > _off_000_D623_10   ; 
C122  .byte > _off_000_D614_11   ; 
C123  .byte > _off_000_D3D6_12   ; 
C124  .byte > _off_000_D3E9_13   ; 
C125  .byte > _off_000_D3FC_14   ; 
C126  .byte > _off_000_D40F_15   ; 
C127  .byte > _off_000_D422_16   ; 
C128  .byte > _off_000_D435_17   ; 
C129  .byte > _off_000_D450_18   ; 
C12A  .byte > _off_000_D631_19   ; 
C12B  .byte > ram_00A1   ;  1A
tbl_C12C_lo:
C12C  .byte < ofs_CB3B_00   ; 
C12D  .byte < ofs_CB77_01   ; 
C12E  .byte < ofs_CBA4_02   ; 
C12F  .byte < ofs_CC6B_03   ; 
tbl_C130_hi:
C130  .byte > ofs_CB3B_00   ; 
C131  .byte > ofs_CB77_01   ; 
C132  .byte > ofs_CBA4_02   ; 
C133  .byte > ofs_CC6B_03   ; 
tbl_C134:
C134  .byte $00   ; 
C135  .byte $FC   ; 
C136  .byte $FC   ; 
C137  .byte $FC   ; 
C138  .byte $79   ; 
C139  .byte $04   ; 
C13A  .byte $72   ; 
C13B  .byte $22   ; 
tbl_C13C:
C13C  .byte $04   ; 
C13D  .byte $21   ; 
C13E  .byte $6F   ; 
C13F  .byte $01   ; 
C140  .byte $00   ; 
C141  .byte $00   ; 
C142  .byte $60   ; 
C143  .byte $9F   ; 
C144  .byte $00   ; 
C145  .byte $17   ; 
C146  .byte $04   ; 
tbl_C147:
C147  .byte $DE   ; 
C148  .byte $DC   ; 
C149  .byte $E1   ; 
C14A  .byte $F8   ; 
C14B  .byte $FC   ; 
C14C  .byte $EF   ; 
C14D  .byte $E1   ; 
C14E  .byte $EE   ; 
C14F  .byte $C9   ; 
tbl_C150:
C150  .byte $44   ; 
C151  .byte $C9   ; 
C152  .byte $00   ; 
C153  .byte $84   ; 
C154  .byte $44   ; 
C155  .byte $F9   ; 
C156  .byte $00   ; 
C157  .byte $74   ; 
tbl_C158:
C158  .byte $07   ; 
C159  .byte $23   ; 
C15A  .byte $78   ; 
C15B  .byte $04   ; 
C15C  .byte $1D   ; 
C15D  .byte $F8   ; 
C15E  .byte $FE   ; 
C15F  .byte $FE   ; 
tbl_C160:
C160  .byte $29   ; 
C161  .byte $01   ; 
C162  .byte $02   ; 
C163  .byte $00   ; 
C164  .byte $02   ; 
C165  .byte $29   ; 
tbl_C166:
C166  .byte $30   ; 
C167  .byte $35   ; 
C168  .byte $25   ; 
C169  .byte $35   ; 
tbl_C16A:
C16A  .byte $22   ; 
C16B  .byte $26   ; 
C16C  .byte $1C   ; 
C16D  .byte $22   ; 
C16E  .byte $22   ; 
C16F  .byte $22   ; 
tbl_C170:
C170  .byte $26   ; 
C171  .byte $06   ; 
C172  .byte $36   ; 
C173  .byte $26   ; 
C174  .byte $01   ; 
C175  .byte $40   ; 
C176  .byte $7F   ; 
C177  .byte $09   ; 
tbl_C178:
C178  .byte $C7   ; 
C179  .byte $DB   ; 
C17A  .byte $00   ; 
C17B  .byte $E0   ; 
C17C  .byte $C7   ; 
C17D  .byte $DD   ; 
C17E  .byte $00   ; 
C17F  .byte $E8   ; 
tbl_C180:
C180  .byte $17   ; 
C181  .byte $01   ; 
C182  .byte $00   ; 
C183  .byte $01   ; 
vec_C184_RESET:
C184  SEI
C185  CLD
C186  LDA #$00
C188  STA $2000
C18B  LDX #$FF
C18D  TXS
bra_C18E_infinite_loop:
C18E  LDA $2002
C191  AND #$80
C193  BEQ bra_C18E_infinite_loop
bra_C195_infinite_loop:
C195  LDA $2002
C198  AND #$80
C19A  BEQ bra_C195_infinite_loop
C19C  LDY #$07
C19E  LDA ram_reset_check_1
C1A1  CMP #$A5
C1A3  BNE bra_C1AE
C1A5  LDA ram_reset_check_2
C1A8  CMP #$5A
C1AA  BNE bra_C1AE
C1AC  LDY #$04
bra_C1AE:
C1AE  STY ram_0001
C1B0  LDY #$00
C1B2  STY ram_0000
C1B4  TYA
bra_C1B5_loop:
C1B5  STA (ram_0000),Y
C1B7  DEY
C1B8  BNE bra_C1B5_loop
C1BA  DEC ram_0001
C1BC  BPL bra_C1B5_loop
C1BE  LDA ram_reset_check_1
C1C1  BNE bra_C1C6
C1C3  JSR sub_C1FD
bra_C1C6:
C1C6  STA $4011
C1C9  LDA #$06
C1CB  STA $2001
C1CE  STA ram_0018
C1D0  JSR sub_C318
C1D3  LDA #$90
C1D5  JSR sub_C333
loc_C1D8_loop:
bra_C1D8_loop:
C1D8  JSR sub_D326
C1DB  LDA ram_0048
C1DD  BMI bra_C1D8_loop
C1DF  BEQ bra_C1D8_loop
C1E1  JSR sub_C32F
C1E4  LDA ram_0048
C1E6  CMP #$01
C1E8  BNE bra_C1F7
C1EA  JSR sub_C6C8
loc_C1ED_loop:
C1ED  LDA #$FF
C1EF  STA ram_0048
C1F1  JSR sub_C339
C1F4  JMP loc_C1D8_loop
bra_C1F7:
C1F7  JSR sub_C739
C1FA  JMP loc_C1ED_loop
sub_C1FD:
C1FD  LDX #$1E
bra_C1FF_loop:
C1FF  LDA tbl_C091,X
C202  STA ram_0580,X
C205  STA ram_05A3,X
C208  DEX
C209  BPL bra_C1FF_loop
C20B  LDX #$01
C20D  STX ram_06E0
bra_C210_loop:
C210  LDA #$40
C212  STA ram_06E0,X
C215  INX
C216  CPX #$CF
C218  BCC bra_C210_loop
C21A  LDA #$09
C21C  STA ram_06E0,X
C21F  LDA #$A5
C221  STA ram_reset_check_1
C224  LDA #$5A
C226  STA ram_reset_check_2
sub_C229:
C229  LDX #$00
C22B  LDA #$0A
bra_C22D_loop:
C22D  STA ram_05A0,X
C230  STA ram_05C3,X
C233  LDA #$00
C235  INX
C236  CPX #$03
C238  BCC bra_C22D_loop
C23A  RTS
vec_C23B_NMI:
C23B  JSR sub_C32F
C23E  LDA ram_0045
C240  BNE bra_C24B
C242  LDA ram_0011
C244  ORA #$1A
C246  STA $2001
C249  STA ram_0011
bra_C24B:
C24B  LDA #< ram_oam
C24D  STA $2003
C250  LDA #> ram_oam
C252  STA $4014
C255  JSR sub_C27F
C258  LDA ram_0047
C25A  BEQ bra_C262
C25C  JSR sub_D0AB
C25F  JSR sub_D14E
bra_C262:
C262  LDA ram_pause_flag
C265  ORA ram_pause_timer
C268  BNE bra_C26F
C26A  INC ram_003F
C26C  JSR sub_D310
bra_C26F:
C26F  JSR sub_D347_read_joy_regs
C272  JSR sub_F844
C275  JSR sub_C2A9
C278  LDA $2002
C27B  JSR sub_C339
C27E  RTI
sub_C27F:
C27F  LDX ram_0045
C281  LDA tbl_C0F6_lo,X
C284  STA ram_0000
C286  LDA tbl_C111_hi,X
loc_C289:
C289  STA ram_0001
C28B  JSR sub_D3C1
C28E  LDA #$00
C290  STA ram_0300
C293  STA ram_0301
C296  STA ram_0045
C298  LDA #> $3F00
C29A  STA $2006
C29D  LDA #< $3F00
C29F  STA $2006
; A = 00
C2A2  STA $2006
C2A5  STA $2006
C2A8  RTS
sub_C2A9:
C2A9  LDX ram_0040
C2AB  BEQ bra_C2ED
C2AD  LDA ram_0041
C2AF  ASL
C2B0  TAY
C2B1  LDA tbl_C000,Y
C2B4  STA ram_0000
C2B6  INY
C2B7  LDA tbl_C000,Y
C2BA  JMP loc_CB36
ofs_001_C2BD_00_01:
C2BD  LDA #$04
C2BF  STA ram_03F8
C2C2  LSR ; con_C27F_02
C2C3  STA ram_0045
C2C5  LDY #$00
C2C7  JSR sub_C409
C2CA  LDX ram_03F0
C2CD  BNE bra_C2D3
C2CF  LDA #$01
C2D1  STA ram_00FB
bra_C2D3:
C2D3  CPX #$02
C2D5  BMI bra_C2D9
C2D7  LDX #$FF
bra_C2D9:
C2D9  INX
C2DA  STX ram_03F0
C2DD  LDA #$38
C2DF  STA ram_0031
C2E1  LDA #$0F
C2E3  STA $4015
C2E6  LDA tbl_C080
C2E9  STA ram_spr_Y
bra_C2EC_RTS:
C2EC  RTS
bra_C2ED:
C2ED  JSR sub_D24F_disable_rendering
C2F0  LDA ram_0030
C2F2  BNE bra_C2EC_RTS
C2F4  LDX ram_0041
C2F6  LDA tbl_C01C,X
C2F9  TAX
C2FA  LDA tbl_C02A_lo,X
C2FD  STA ram_0002
C2FF  LDA tbl_C033_hi,X
C302  STA ram_0003
C304  LDY ram_0044
C306  INC ram_0044
C308  DEY
C309  BMI bra_C318
C30B  TYA
C30C  ASL
C30D  TAY
C30E  LDA (ram_0002),Y
C310  STA ram_0000
C312  INY
C313  LDA (ram_0002),Y
C315  JMP loc_CB36
bra_C318:
sub_C318:
C318  JSR sub_D255_hide_all_sprites
C31B  JSR sub_D23B
C31E  JSR sub_D1A9
C321  STA ram_scroll_X
C323  STA ram_0050
C325  STA ram_scroll_Y
C327  STA ram_0051
C329  STA ram_00FC
C32B  LDA #$10
C32D  BNE bra_C333    ; jmp
sub_C32F:
C32F  LDA ram_0010
C331  AND #$7F
bra_C333:
sub_C333:
C333  STA $2000
C336  STA ram_0010
C338  RTS
sub_C339:
bra_C339_infinite_loop:
C339  LDA $2002
C33C  AND #$80
C33E  BNE bra_C339_infinite_loop
C340  LDA ram_0010
C342  ORA #$80
C344  BNE bra_C333    ; jmp
ofs_000_C346_00:
C346  LDA ram_0031
C348  BNE bra_C359
C34A  STA ram_0043
C34C  STA ram_004A
C34E  LDA #$0F
C350  STA ram_03F7
C353  LDA #$02
C355  STA ram_0041
C357  BNE bra_C389
bra_C359:
C359  LDA #$03
C35B  JSR sub_C7DE
C35E  TXA
C35F  BNE bra_C36A
C361  STA ram_03F2
C364  LDA tbl_C080,Y
C367  JMP loc_C3EF
bra_C36A:
loc_C36A:
C36A  LDY ram_0042
C36C  LDX #$00
C36E  STX ram_03F7
C371  STX ram_0043
C373  STX ram_0042
C375  INX
C376  STX ram_03F3
C379  STX ram_004A
C37B  STX ram_03F0
C37E  CPY #$02
C380  BNE bra_C384
C382  LDX #$08
bra_C384:
C384  STX ram_0041
C386  STY ram_03F2
bra_C389:
C389  JSR sub_C3B1
C38C  LDA ram_03F7
C38F  EOR #$0F
C391  STA $4015
C394  RTS
ofs_000_C395_01:
C395  LDA ram_btn_press
C397  AND #con_btns_ABSS + con_btns_LR
C399  STA ram_btn_press
C39B  AND #con_btns_LR    ; bzk optimize, seems useless
C39D  ASL
C39E  ASL
C39F  ORA ram_btn_press
C3A1  STA ram_btn_press
C3A3  LDA #$05
C3A5  JSR sub_C7DE
C3A8  TXA
C3A9  BEQ bra_C3B8
C3AB  LDA ram_0042
C3AD  STA ram_0043
loc_C3AF:
sub_C3AF:
C3AF  INC ram_0041
bra_C3B1:
sub_C3B1:
C3B1  LDA #$00
C3B3  STA ram_0040
C3B5  STA ram_0044
C3B7  RTS
bra_C3B8:
C3B8  LDA tbl_C083,Y
C3BB  BNE bra_C411    ; jmp
ofs_000_C3BD_08:
C3BD  LDA #$06
C3BF  JSR sub_C7DE
C3C2  TXA
C3C3  BEQ bra_C3EA
C3C5  LDA ram_0042
C3C7  CMP #$02
C3C9  BEQ bra_C3D2
C3CB  BCS bra_C3D5
C3CD  STA ram_03F2
C3D0  INC ram_0041
bra_C3D2:
C3D2  JMP loc_C3AF
bra_C3D5:
C3D5  CMP #$05
C3D7  BEQ bra_C3E4
C3D9  CLC
C3DA  ADC #$09
C3DC  STA ram_0041
C3DE  LDA #$00
C3E0  STA ram_0042
C3E2  BEQ bra_C3B1    ; jmp
bra_C3E4:
C3E4  LSR
C3E5  STA ram_0042
C3E7  JMP loc_CA85
bra_C3EA:
C3EA  LDY ram_0042
C3EC  LDA tbl_C08B,Y
bra_C3EF:
loc_C3EF:
C3EF  STA ram_spr_Y
C3F2  RTS
ofs_001_C3F3_01_02:
C3F3  LDX #$04
C3F5  STX ram_00FB
C3F7  DEX ; con_C27F_03
C3F8  STX ram_0045
C3FA  LDY #$01
C3FC  JSR sub_C409
C3FF  STA ram_0042
C401  LDA #$2D
C403  STA ram_0034
C405  LDA #$B0
C407  BNE bra_C3EF    ; jmp
sub_C409:
C409  LDA #$FA
C40B  STA ram_spr_T
C40E  LDA tbl_C088,Y
bra_C411:
C411  STA ram_spr_X
C414  LDA #$00
C416  STA ram_spr_A
C419  STA ram_0046
C41B  RTS
ofs_000_C41C_0D:
C41C  LDA #$02
C41E  LDX ram_0044
C420  BEQ bra_C450
C422  LDA ram_0048
C424  CMP #$FF
C426  BNE bra_C454_RTS
C428  LDX #$02
bra_C42A_loop:
C42A  LDA ram_0065,X
C42C  STA ram_05A0,X
C42F  LDA ram_0068,X
C431  STA ram_05C3,X
C434  DEX
C435  BPL bra_C42A_loop
C437  JSR sub_EC3B
C43A  JMP loc_C447
ofs_000_C43D_0C:
C43D  LDA ram_0044
C43F  BEQ bra_C44E
C441  LDA ram_0048
C443  CMP #$FF
C445  BNE bra_C454_RTS
loc_C447:
C447  LDA #$40
C449  STA ram_00FB
C44B  JMP loc_CC6B
bra_C44E:
C44E  LDA #$01
bra_C450:
C450  STA ram_0048
C452  STA ram_0044
bra_C454_RTS:
C454  RTS
ofs_001_C455_03_03:
C455  LDY #con_C27F_08
C457  LDA ram_0041
C459  CMP #$08
C45B  BCS bra_C462
C45D  LDA ram_0046
C45F  BEQ bra_C464_RTS
C461  DEY ; con_C27F_07
bra_C462:
C462  STY ram_0045
bra_C464_RTS:
C464  RTS
ofs_000_C465_04:
ofs_000_C465_07:
C465  LDA ram_0034
C467  BEQ bra_C477
C469  LDA #$06
C46B  JSR sub_C92C
C46E  LDA ram_003F
C470  AND #$10
C472  BNE bra_C464_RTS
C474  JMP loc_CAFA
bra_C477:
C477  JSR sub_C3AF
C47A  LDA ram_0041
C47C  CMP #$08
C47E  BCC bra_C482
C480  LDA #$02
bra_C482:
C482  STA ram_0041
C484  RTS
ofs_001_C485_03_05:
C485  JSR sub_C53A
C488  LDA ram_0005
C48A  CMP ram_0068
C48C  BNE bra_C49A
C48E  LDA ram_0006
C490  CMP ram_0069
C492  BNE bra_C49A
C494  LDA ram_0007
C496  CMP ram_006A
C498  BEQ bra_C4A9
bra_C49A:
C49A  BCC bra_C4AD
C49C  LDX #$00
bra_C49E_loop:
C49E  LDA ram_0068,X
C4A0  STA ram_0580,Y
C4A3  INX
C4A4  INY
C4A5  CPX #$03
C4A7  BMI bra_C49E_loop
bra_C4A9:
C4A9  LDA #$01
C4AB  BNE bra_C512    ; jmp
bra_C4AD:
C4AD  LDA ram_0041
C4AF  CMP #$08
C4B1  BCS bra_C4CC
C4B3  JSR sub_C522
C4B6  LDA ram_0005
C4B8  CMP ram_0068
C4BA  BNE bra_C4C6
C4BC  LDA ram_0006
C4BE  CMP ram_0069
C4C0  BNE bra_C4C6
C4C2  LDA ram_0007
C4C4  CMP ram_006A
bra_C4C6:
C4C6  BCC bra_C4CC
C4C8  LDA #$02
C4CA  BNE bra_C512    ; jmp
bra_C4CC:
C4CC  LDA ram_03F8
C4CF  STA ram_000A
C4D1  ASL
C4D2  STA ram_0009
C4D4  LDA ram_0068
C4D6  SEC
C4D7  SBC ram_0005
C4D9  TAY
C4DA  LDA #$00
bra_C4DC_loop:
C4DC  DEY
C4DD  BMI bra_C4E8
C4DF  CLC
C4E0  ADC #$3C
C4E2  BCC bra_C4DC_loop
bra_C4E4:
C4E4  LDA #$FF
C4E6  BNE bra_C50B    ; jmp
bra_C4E8:
C4E8  STA ram_0008
C4EA  LDA ram_0069
C4EC  SEC
C4ED  SBC ram_0006
C4EF  BCS bra_C4F7
C4F1  CLC
C4F2  ADC ram_0008
C4F4  JMP loc_C4FC
bra_C4F7:
C4F7  CLC
C4F8  ADC ram_0008
C4FA  BCS bra_C4E4
loc_C4FC:
C4FC  CMP ram_0009
C4FE  BCS bra_C50B
C500  CLC
C501  ADC ram_0009
loc_C503_loop:
C503  LSR ram_000A
C505  BEQ bra_C512
C507  LSR
C508  JMP loc_C503_loop
bra_C50B:
C50B  SEC
C50C  SBC ram_0009
C50E  LSR
C50F  CLC
C510  ADC #$04
bra_C512:
C512  STA ram_0053
ofs_001_C514_00_02:
ofs_001_C514_01_03:
ofs_001_C514_04_04:
ofs_001_C514_06_03:
C514  LDA #con_C27F_18
C516  STA ram_0045
ofs_001_C518_07_03:
ofs_001_C518_08_02:
C518  LDA #$01
C51A  STA ram_0049
C51C  STA ram_0040
C51E  LSR
C51F  STA ram_0044
C521  RTS
sub_C522:
C522  LDA ram_0043
C524  STA ram_0002
C526  JSR sub_CB13
C529  TAY
C52A  LDA tbl_C091,Y
C52D  STA ram_0005
C52F  LDA tbl_C091 + $01,Y
C532  STA ram_0006
C534  LDA tbl_C091 + $02,Y
C537  STA ram_0007
C539  RTS
sub_C53A:
C53A  LDA ram_0043
C53C  STA ram_0002
sub_C53E:
C53E  JSR sub_CB06
C541  LDA ram_0580,Y
C544  STA ram_0005
C546  LDA ram_0581,Y
C549  STA ram_0006
C54B  LDA ram_0582,Y
C54E  STA ram_0007
C550  RTS
ofs_001_C551_02_01:
ofs_001_C551_05_01:
C551  LDA #con_C27F_12
C553  LDX ram_0041
C555  CPX #$08
C557  BCS bra_C56E
; bzk optimize, C = 0, no need for CLC
C559  CLC
C55A  ADC ram_0043
; con_C27F_12
; con_C27F_13
; con_C27F_14
; con_C27F_15
; con_C27F_16
C55C  BNE bra_C56E    ; jmp
ofs_001_C55E_01_01:
ofs_001_C55E_03_01:
ofs_001_C55E_04_01:
ofs_001_C55E_06_01:
C55E  LDA #con_C27F_06
C560  BNE bra_C56E    ; jmp
ofs_001_C562_05_05:
C562  LDA #con_C27F_05
C564  BNE bra_C56E    ; jmp
ofs_001_C566_02_05:
C566  LDA #con_C27F_0E
C568  BNE bra_C56E    ; jmp
ofs_001_C56A_03_02:
C56A  LDA #con_C27F_04
C56C  STA ram_0033
bra_C56E:
C56E  STA ram_0045
C570  RTS
ofs_001_C571_04_02:
C571  LDA #con_C27F_09
C573  BNE bra_C56E    ; jmp
ofs_001_C575_06_02:
C575  LDA #$05
C577  STA ram_0043
C579  LDY #$02
C57B  JSR sub_C409
C57E  LDA #con_C27F_0F
C580  BNE bra_C56E    ; jmp
ofs_001_C582_08_01:
C582  LDA #con_C27F_11
C584  BNE bra_C56E    ; jmp
ofs_001_C586_07_02:
C586  LDX #$03
C588  BNE bra_C594    ; jmp
bra_C58A_loop:
C58A  LDA ram_05A0,X
C58D  STA ram_0065,X
C58F  LDA ram_05C3,X
C592  STA ram_0068,X
bra_C594:
C594  LDA tbl_C180,X
C597  STA ram_0061,X
C599  DEX
C59A  BPL bra_C58A_loop
C59C  JSR sub_C621
C59F  LDA #con_C27F_10
C5A1  BNE bra_C56E    ; jmp
ofs_001_C5A3_02_04:
ofs_001_C5A3_05_04:
C5A3  LDA #con_C27F_17
C5A5  BNE bra_C56E    ; jmp
ofs_001_C5A7_03_04:
C5A7  LDA #$00
C5A9  JMP loc_C92C
ofs_001_C5AC_04_03:
C5AC  LDA #$12
C5AE  STA ram_0034
C5B0  LDX #$05
bra_C5B2_loop:
C5B2  LDA tbl_C13C,X
C5B5  STA ram_0300,X
C5B8  DEX
C5B9  BPL bra_C5B2_loop
C5BB  LDX ram_0043
C5BD  INX
C5BE  STX ram_0304
C5C1  RTS
ofs_001_C5C2_05_06:
C5C2  LDX #$01
C5C4  STX ram_00B7
C5C6  JSR sub_C621
C5C9  STX ram_00BD
C5CB  STX ram_00BE
C5CD  STX ram_00C4
C5CF  STX ram_00C0
C5D1  STX ram_0049
C5D3  STX ram_00C2
C5D5  INX
C5D6  STX ram_05E0
C5D9  LDA #$06
C5DB  STA ram_00AC
C5DD  LDA #$A0
C5DF  STA ram_008C
C5E1  LDA #$10
C5E3  STA ram_0080
C5E5  LDA #$04
C5E7  STA ram_0004
C5E9  LDX #$00
C5EB  STX ram_000B
C5ED  JSR sub_E1A3
C5F0  LDX #$07
bra_C5F2_loop:
C5F2  LDA tbl_C178,X
C5F5  STA ram_oam + $28,X
C5F8  DEX
C5F9  BPL bra_C5F2_loop
C5FB  LDA #$05
C5FD  STA ram_00B1
C5FF  STA ram_00B2
C601  LDA #$21
C603  STA ram_00B0
C605  LDA #$03
C607  STA ram_00B3
C609  LDA #$08
C60B  STA ram_0064
C60D  STA ram_00E0
C60F  INC ram_00E0
C611  LDA #$7A
C613  STA ram_00B4
C615  INC ram_0040
C617  INC ram_0047
C619  LDA #$D0
C61B  JSR sub_EC25
C61E  JMP loc_EC47
sub_C621:
C621  LDX #$00
bra_C623_loop:
C623  LDA ram_06E0,X
C626  STA ram_05E0,X
C629  DEX
C62A  BNE bra_C623_loop
C62C  RTS
sub_C62D:
C62D  LDA #$05
C62F  STA $4016
; bzk optimize, useless (probably) code up to C637
C632  PHA
C633  PLA
C634  PHA
C635  PLA
C636  PHA
C637  PLA
C638  RTS
sub_C639:
bra_C639_loop:
C639  JSR sub_C62D
C63C  LDA $4016
C63F  AND #$02
C641  BEQ bra_C639_loop
bra_C643_loop:
C643  JSR sub_C62D
C646  LDA $4016
C649  AND #$02
C64B  BNE bra_C643_loop
C64D  RTS
sub_C64E:
C64E  PHA
C64F  LDA #$34
C651  BNE bra_C656    ; jmp
sub_C653:
loc_C653:
C653  PHA
C654  LDA #$6A
bra_C656:
C656  STA ram_0007
C658  STA ram_000C
C65A  LDA #$04
C65C  STA $4016
bra_C65F_loop:
C65F  DEC ram_0007
C661  BNE bra_C65F_loop
C663  LDA #$FF
C665  STA $4016
bra_C668_loop:
C668  DEC ram_000C
C66A  BNE bra_C668_loop
C66C  PLA
C66D  RTS
sub_C66E:
C66E  JSR sub_C653
C671  LDX #$08
bra_C673_loop:
C673  STA ram_0000
C675  CLC
C676  ADC ram_0000
C678  BCS bra_C681
C67A  JSR sub_C64E
loc_C67D:
C67D  DEX
C67E  BNE bra_C673_loop
C680  RTS
bra_C681:
C681  JSR sub_C653
C684  JSR sub_C68A
C687  JMP loc_C67D
sub_C68A:
C68A  INC ram_0008
C68C  BNE bra_C690_RTS
C68E  INC ram_0009
bra_C690_RTS:
C690  RTS
sub_C691:
C691  JSR sub_C639
C694  LDA #$4E
C696  STA ram_0001
bra_C698_garbage_loop:
C698  DEC ram_0001
C69A  BNE bra_C698_garbage_loop
C69C  JSR sub_C62D
C69F  LDA $4016
C6A2  AND #$02
C6A4  RTS
sub_C6A5:
C6A5  LDA #$08
C6A7  STA ram_0003
C6A9  LDA #$00
C6AB  STA ram_0004
bra_C6AD_loop:
C6AD  LDA ram_0004
C6AF  CLC
C6B0  ADC ram_0004
C6B2  STA ram_0004
C6B4  JSR sub_C691
C6B7  BNE bra_C6BE
C6B9  JSR sub_C68A
C6BC  INC ram_0004
bra_C6BE:
C6BE  DEC ram_0003
C6C0  BNE bra_C6AD_loop
C6C2  JSR sub_C639
C6C5  LDA ram_0004
C6C7  RTS
sub_C6C8:
C6C8  JSR sub_C716
C6CB  JSR sub_C6D1
C6CE  JSR sub_C726
sub_C6D1:
C6D1  LDA #$20
C6D3  STA ram_000A
C6D5  LDA #$4E
C6D7  STA ram_000B
bra_C6D9_loop:
C6D9  JSR sub_C64E
C6DC  DEC ram_000A
C6DE  BNE bra_C6D9_loop
C6E0  DEC ram_000B
C6E2  BNE bra_C6D9_loop
bra_C6E4_loop:
C6E4  JSR sub_C653
C6E7  DEC ram_0005
C6E9  BNE bra_C6E4_loop
bra_C6EB_loop:
C6EB  JSR sub_C64E
C6EE  DEC ram_0006
C6F0  BNE bra_C6EB_loop
C6F2  JSR sub_C653
C6F5  LDA #$00
C6F7  STA ram_0008
C6F9  STA ram_0009
C6FB  LDY #$00
bra_C6FD_loop:
C6FD  LDA (ram_000E),Y
C6FF  JSR sub_C66E
C702  INY
C703  CPY ram_000D
C705  BNE bra_C6FD_loop
C707  LDA ram_0009
C709  PHA
C70A  LDA ram_0008
C70C  JSR sub_C66E
C70F  PLA
C710  JSR sub_C66E
C713  JMP loc_C653
sub_C716:
C716  LDA #$40
C718  STA ram_000D
C71A  LDA #$60
C71C  STA ram_000E
C71E  LDA #$00
C720  STA ram_000F
C722  LDA #$28
C724  BNE bra_C734    ; jmp
sub_C726:
C726  LDA #$00
C728  STA ram_000D
C72A  LDA #$E0
C72C  STA ram_000E
C72E  LDA #$05
C730  STA ram_000F
C732  LDA #$14
bra_C734:
C734  STA ram_0005
C736  STA ram_0006
C738  RTS
sub_C739:
bra_C739_loop:
C739  JSR sub_C32F
C73C  JSR sub_C716
C73F  JSR sub_C792
C742  BCC bra_C751
bra_C744_loop:
C744  LDA #con_C27F_19
C746  STA ram_0045
bra_C748:
C748  JSR sub_C339
bra_C74B_loop:
C74B  LDA ram_0045
C74D  BNE bra_C74B_loop
C74F  BEQ bra_C739_loop    ; jmp
bra_C751:
C751  LDX #$00
C753  STX ram_00A8
C755  LDY #$01
bra_C757_loop:
C757  LDA (ram_000E),Y
C759  STA ram_00A3,Y
C75C  CMP tbl_C180 - $01,Y
C75F  BEQ bra_C762
C761  INX
bra_C762:
C762  INY
C763  CPY #$05
C765  BNE bra_C757_loop
C767  LDA #$07
C769  STA ram_00A0
C76B  LDA #$22
C76D  STA ram_00A1
C76F  LDA #$4F
C771  STA ram_00A2
C773  LDA #$04
C775  STA ram_00A3
C777  LDA #con_C27F_1A
C779  STA ram_0045
C77B  CPX #$00
C77D  BNE bra_C748
C77F  JSR sub_C339
bra_C782_infinite_loop:
C782  LDA ram_0045
C784  BNE bra_C782_infinite_loop
C786  JSR sub_C32F
C789  JSR sub_C726
C78C  JSR sub_C792
C78F  BCS bra_C744_loop
C791  RTS
sub_C792:
bra_C792_loop:
C792  LDA ram_0005
C794  STA ram_0000
bra_C796_loop:
C796  JSR sub_C691
C799  BNE bra_C792_loop
C79B  DEC ram_0000
C79D  BNE bra_C796_loop
C79F  LDA ram_0006
C7A1  STA ram_0000
bra_C7A3_loop:
C7A3  JSR sub_C691
C7A6  BEQ bra_C792_loop
C7A8  DEC ram_0000
C7AA  BNE bra_C7A3_loop
C7AC  LDA #$00
C7AE  STA ram_0008
C7B0  STA ram_0009
C7B2  JSR sub_C639
C7B5  JSR sub_C639
C7B8  LDY #$00
bra_C7BA_loop:
C7BA  JSR sub_C6A5
C7BD  STA (ram_000E),Y
C7BF  INY
C7C0  CPY ram_000D
C7C2  BNE bra_C7BA_loop
C7C4  LDA ram_0008
C7C6  STA ram_000A
C7C8  LDA ram_0009
C7CA  STA ram_000B
C7CC  JSR sub_C6A5
C7CF  CMP ram_000A
C7D1  BNE bra_C7DA
C7D3  JSR sub_C6A5
C7D6  CMP ram_000B
C7D8  BEQ bra_C7DC
bra_C7DA:
C7DA  SEC
C7DB  RTS
bra_C7DC:
C7DC  CLC
C7DD  RTS
sub_C7DE:
C7DE  STA ram_0000
C7E0  LDY ram_0042
C7E2  LDX #$00
C7E4  LDA ram_btn_press
C7E6  AND #con_btns_SS + con_btns_UD
C7E8  BNE bra_C7ED
C7EA  STA ram_0049
bra_C7EC_RTS:
C7EC  RTS
bra_C7ED:
C7ED  LDA #$5D
C7EF  STA ram_0031
C7F1  LDA ram_0049
C7F3  BNE bra_C7EC_RTS
C7F5  LDA ram_btn_press
C7F7  BIT tbl_C0CE
C7FA  BNE bra_C80A
C7FC  LSR
C7FD  LSR
C7FE  LSR
C7FF  BCS bra_C80A
C801  LSR
C802  BCS bra_C811
C804  LDX #$04
C806  STX ram_0030
C808  BNE bra_C81B
bra_C80A:
C80A  INY
C80B  CPY ram_0000
C80D  BCC bra_C817
C80F  LDY #$01
bra_C811:
C811  DEY
C812  BPL bra_C817
C814  LDY ram_0000
C816  DEY
bra_C817:
C817  LDA #$01
C819  STA ram_00FF
bra_C81B:
C81B  STY ram_0042
C81D  INC ram_0049
C81F  RTS
ofs_001_C820_02_03:
ofs_001_C820_05_03:
C820  JSR sub_D13F
C823  LDA #$03
C825  STA ram_0001
C827  LSR ; con_C27F_01
C828  STA ram_0045
C82A  LSR ; 00
C82B  STA ram_0000
C82D  STA ram_004B
C82F  LDY #$EF
bra_C831_loop:
C831  STA (ram_0000),Y
C833  DEY
C834  CPY #$40
C836  BCS bra_C831_loop
C838  LDX #$7F
bra_C83A_loop:
C83A  LDA #$3B
C83C  STA ram_0400,X
C83F  LDA #$3D
C841  STA ram_0480,X
C844  STA ram_0500,X
C847  DEX
C848  BPL bra_C83A_loop
C84A  LDA #$BF
C84C  STA ram_spr_Y
C84F  LDA #$F7
C851  STA ram_spr_X
C854  LDA #$FF
C856  STA ram_spr_T
C859  LDA #$3F
C85B  STA ram_00E8
C85D  LSR
C85E  STA ram_00E9
C860  LDA #$0A
C862  STA ram_00EB
C864  LDA #$25
C866  STA ram_00EA
C868  RTS
ofs_001_C869_02_02:
ofs_001_C869_07_01:
ofs_001_C869_05_02:
; clear 004D-00EF
; bzk optimize
C869  LDA #$00
C86B  LDX #$EF
bra_C86D_loop:
C86D  STA ram_0000,X
C86F  DEX
C870  CPX #$4C
C872  BNE bra_C86D_loop
C874  RTS
ofs_001_C875_02_06:
C875  INC ram_0047
C877  INC ram_0040
C879  LDA ram_0034
C87B  BNE bra_C87F
C87D  LDA #$05
bra_C87F:
C87F  STA ram_0034
C881  LDA #$34
C883  STA ram_00E8
C885  LDA #$14
C887  STA ram_00E9
C889  LDA #$A0
C88B  STA ram_03F1
C88E  LDA #$80
C890  STA ram_03B4
C893  STA ram_03B0
C896  LDA #$FF
C898  STA ram_03BD
C89B  LDX #$01
C89D  STX ram_0370
C8A0  INX ; 02
C8A1  STX ram_03BE
C8A4  INX ; 03
C8A5  LDA ram_03F2
C8A8  BNE bra_C8AC
C8AA  LDX #$00
bra_C8AC:
bra_C8AC_loop:
C8AC  LDA tbl_C0B4,X
C8AF  STA ram_00B8,X
C8B1  LDA #$08
C8B3  STA ram_0064,X
C8B5  LDA tbl_C0B0,X
C8B8  STA ram_00E0,X
C8BA  LDA tbl_C0B8,X
C8BD  STA ram_0080,X
C8BF  LDA #$06
C8C1  STA ram_00AC,X
C8C3  STA ram_0078,X
C8C5  LDA #$01
C8C7  STA ram_0084,X
C8C9  STA ram_00A8,X
C8CB  LDA ram_0019,X
C8CD  LSR
C8CE  STA ram_0074,X
C8D0  DEX
C8D1  BPL bra_C8AC_loop
C8D3  LDA ram_0019,X
C8D5  AND #$03
C8D7  BNE bra_C8DB
C8D9  LDA #$02
bra_C8DB:
C8DB  TAX
C8DC  LSR ram_0078,X
C8DE  LDA ram_0046
C8E0  BEQ bra_C902
C8E2  LDA ram_0043
C8E4  CMP #$04
C8E6  BNE bra_C902
C8E8  LDX #$07
bra_C8EA_loop:
C8EA  LDA tbl_C158,X
C8ED  STA ram_0300,X
C8F0  DEX
C8F1  BPL bra_C8EA_loop
C8F3  LDA ram_03F3
C8F6  JSR sub_DFA2
C8F9  STA ram_0307
C8FC  TXA
C8FD  BEQ bra_C902
C8FF  STA ram_0306
bra_C902:
C902  JSR sub_C522
C905  LDA ram_0041
C907  CMP #$08
C909  BCC bra_C90E
C90B  JSR sub_C53A
bra_C90E:
C90E  LDA ram_03F8
C911  ASL
C912  CLC
C913  ADC ram_0006
C915  CMP #$3C
C917  BCC bra_C91D
C919  SBC #$3C
C91B  INC ram_0005
bra_C91D:
C91D  STA ram_0006
C91F  LDA #$00
C921  STA ram_0007
C923  LDA #$02
C925  STA ram_0003
C927  JSR sub_C935
C92A  LDA #$08
sub_C92C:
loc_C92C:
C92C  LDY ram_0043
C92E  STY ram_0002
C930  STA ram_0003
C932  JSR sub_C53E
sub_C935:
C935  LDX #$05
C937  JSR sub_DF7F
C93A  LDX ram_0300
C93D  LDY #$00
bra_C93F_loop:
C93F  LDA ram_03D1,Y
C942  STA ram_0304,X
C945  INX
C946  INY
C947  CPY #$07
C949  BCC bra_C93F_loop
sub_C94B:
C94B  LDA #$0A
C94D  JSR sub_C971
C950  LDY ram_0003
C952  LDA tbl_C0EC,Y
C955  STA ram_0301,X
C958  LDA tbl_C0EC + $01,Y
C95B  STA ram_0302,X
C95E  LDA #$FB
C960  STA ram_0305,X
C963  STA ram_0308,X
C966  LDA #$07
C968  STA ram_0303,X
C96B  LDA #$00
C96D  STA ram_030B,X
C970  RTS
sub_C971:
C971  LDX ram_0300
C974  CLC
C975  ADC ram_0300
C978  STA ram_0300
C97B  RTS
ofs_000_C97C_09:
C97C  JSR sub_CA1B
C97F  JSR sub_EB17
C982  JSR sub_DA6A
C985  JSR sub_DBFE
C988  JSR sub_E70B
C98B  JSR sub_F4FF
C98E  JSR sub_F68D
C991  JSR sub_F755
C994  JSR sub_C229
bra_C997:
C997  JMP loc_D19B
ofs_000_C99A_02:
ofs_000_C99A_05:
ofs_000_C99A_0A:
C99A  JSR sub_CA08
C99D  LDA ram_pause_flag
C9A0  ORA ram_pause_timer
C9A3  BNE bra_C997
C9A5  JSR sub_D918
C9A8  JSR sub_DD8D
C9AB  JSR sub_E733
C9AE  JSR sub_E927
C9B1  LDA ram_0052
C9B3  BEQ bra_C9BB
C9B5  JSR sub_CA9B
C9B8  JMP loc_C9D5
bra_C9BB:
C9BB  LDA ram_03F2
C9BE  BEQ bra_C9C9
C9C0  JSR sub_DA9F
C9C3  JSR sub_DBC4
C9C6  JSR sub_DEBB
bra_C9C9:
C9C9  JSR sub_DF30
C9CC  JSR sub_EAC5
C9CF  JSR sub_DFD5
C9D2  JSR sub_E09F
loc_C9D5:
C9D5  JSR sub_DDD1
C9D8  JSR sub_CD1F
C9DB  JSR sub_E96C
C9DE  JSR sub_DE31
C9E1  JSR sub_E836
C9E4  JSR sub_EA44
C9E7  JSR sub_F4FF
C9EA  JSR sub_E4C8
C9ED  JSR sub_DEE2
C9F0  JSR sub_E359
C9F3  JSR sub_E17F
C9F6  JSR sub_E456
C9F9  JSR sub_DA26
C9FC  JSR sub_E70B
C9FF  JSR sub_D19B
CA02  JSR sub_CED0
CA05  JMP loc_E42B
sub_CA08:
CA08  LDX #$03
bra_CA0A_loop:
CA0A  JSR sub_DCA0
CA0D  JSR sub_DFB2
CA10  DEX
CA11  BPL bra_CA0A_loop
CA13  LDA ram_03F7
CA16  BNE bra_CA20
CA18  JSR sub_CA38_pause_and_unpause
sub_CA1B:
CA1B  LDA ram_btn_hold
CA1D  STA ram_005C
CA1F  RTS
bra_CA20:
CA20  LDA ram_03F7
CA23  BEQ bra_CA84_RTS
CA25  LDA ram_btn_press
CA27  ASL
CA28  ASL
CA29  ASL
CA2A  BCS bra_CA85
CA2C  ASL
CA2D  BCC bra_CA84_RTS
CA2F  LDA #$00
CA31  STA ram_0042
CA33  STA ram_0047
CA35  JMP loc_C36A
sub_CA38_pause_and_unpause:
CA38  LDA ram_pause_timer
CA3B  BNE bra_CA63
CA3D  LDA ram_btn_press
CA3F  AND #con_btn_Start
CA41  BEQ bra_CA67
CA43  LDA ram_03B0
CA46  BNE bra_CA67
CA48  LDA #$80
CA4A  STA ram_00FB
CA4C  STA ram_03B0
CA4F  ASL
CA50  STA ram_00FC
CA52  LDA ram_pause_flag
CA55  EOR #$01
CA57  STA ram_pause_flag
CA5A  BNE bra_CA7F
CA5C  LDA #$0F
CA5E  STA $4015
CA61  BNE bra_CA7F    ; jmp
bra_CA63:
CA63  DEC ram_pause_timer
CA66  RTS
bra_CA67:
CA67  STA ram_03B0
CA6A  LDA ram_pause_flag
CA6D  BEQ bra_CA84_RTS
CA6F  LDA #$00
CA71  STA $4015
CA74  LDA ram_btn_press
CA76  AND #con_btns_Dpad
CA78  BEQ bra_CA84_RTS
CA7A  LDA ram_pause_timer
CA7D  BNE bra_CA84_RTS
bra_CA7F:
CA7F  LDA #$28
CA81  STA ram_pause_timer
bra_CA84_RTS:
CA84  RTS
bra_CA85:
loc_CA85:
CA85  LDA ram_0042
CA87  PHA
CA88  LDX #$FF
CA8A  LDA #$00
bra_CA8C_loop:
CA8C  STA ram_0000,X
CA8E  DEX
CA8F  CPX #$20
CA91  BNE bra_CA8C_loop
CA93  STA ram_00FC
CA95  INC ram_0049
CA97  PLA
CA98  STA ram_0042
CA9A  RTS
sub_CA9B:
CA9B  LDA ram_0032
CA9D  BNE bra_CAAA
CA9F  JSR sub_C3AF
CAA2  LDA ram_03F7
CAA5  BNE bra_CA85
CAA7  STA ram_0047
bra_CAA9_RTS:
CAA9  RTS
bra_CAAA:
CAAA  LDA #$00
CAAC  STA ram_00FC
CAAE  STA ram_03A9
CAB1  STA ram_03E0
CAB4  STA ram_003C
CAB6  LDX ram_0052
CAB8  DEX
CAB9  BNE bra_CAA9_RTS
CABB  LDA ram_003F
CABD  LSR
CABE  BCS bra_CAF3
CAC0  LSR
CAC1  BCS bra_CAF3
CAC3  AND #$03
CAC5  TAY
CAC6  LDA #$3F
CAC8  STA ram_0312
CACB  LDA #$00
CACD  STA ram_0313
CAD0  STA ram_0319
CAD3  LDA #$04
CAD5  STA ram_0314
CAD8  LDA tbl_C166,Y
CADB  STA ram_0316
CADE  LDA tbl_C170,Y
CAE1  STA ram_0318
CAE4  LDY ram_0043
CAE6  LDA tbl_C160,Y
CAE9  STA ram_0315
CAEC  LDA tbl_C16A,Y
CAEF  STA ram_0317
CAF2  RTS
bra_CAF3:
CAF3  LDX #$11
CAF5  LDA ram_0032
CAF7  LSR
CAF8  BCS bra_CB05_RTS
loc_CAFA:
CAFA  LDY #$06
CAFC  LDA #$FE
bra_CAFE_loop:
CAFE  STA ram_0304,X
CB01  INX
CB02  DEY
CB03  BPL bra_CAFE_loop
bra_CB05_RTS:
CB05  RTS
sub_CB06:
CB06  JSR sub_CB13
CB09  LDY ram_03F2
CB0C  BEQ bra_CB11
CB0E  CLC
CB0F  ADC #$23
bra_CB11:
CB11  TAY
CB12  RTS
sub_CB13:
CB13  LDA #$20
CB15  LDY ram_0002
CB17  CPY #$05
CB19  BEQ bra_CB2B_RTS
CB1B  LDA #$00
bra_CB1D_loop:
CB1D  DEY
CB1E  BMI bra_CB25
CB20  CLC
CB21  ADC #$03
CB23  BNE bra_CB1D_loop
bra_CB25:
CB25  LDY ram_0046
CB27  BEQ bra_CB2B_RTS
CB29  ORA #$10
bra_CB2B_RTS:
CB2B  RTS
ofs_000_CB2C_03:
ofs_000_CB2C_06:
ofs_000_CB2C_0B:
CB2C  LDY ram_0044
CB2E  LDA tbl_C12C_lo,Y
CB31  STA ram_0000
CB33  LDA tbl_C130_hi,Y
loc_CB36:
CB36  STA ram_0001
CB38  JMP (ram_0000)
ofs_CB3B_00:
CB3B  LDA ram_0041
CB3D  CMP #$08
CB3F  BCS bra_CB73
CB41  LDA ram_03F2
CB44  STA ram_0042
CB46  LDA ram_0053
CB48  CMP #$04
CB4A  BCS bra_CB73
CB4C  LDA ram_0046
CB4E  BEQ bra_CB6D
CB50  LDA ram_0043
CB52  CMP #$04
CB54  BNE bra_CB69
CB56  INC ram_03F3
CB59  LDA ram_03F3
CB5C  LSR
CB5D  BCS bra_CB6D
CB5F  LDA ram_03F8
CB62  LSR
CB63  BEQ bra_CB6D
CB65  STA ram_03F8
CB68  SEC
bra_CB69:
CB69  BCS bra_CB6D
CB6B  INC ram_0043
bra_CB6D:
CB6D  LDA #$01
CB6F  STA ram_0046
CB71  STA ram_004B
bra_CB73:
CB73  LDA #$04
CB75  BNE bra_CB9F    ; jmp
ofs_CB77_01:
CB77  LDY ram_0033
CB79  BNE bra_CBA3_RTS
CB7B  LDA #$04
CB7D  STA ram_0003
CB7F  LDX ram_0300
bra_CB82_loop:
CB82  LDA ram_03D9,Y
CB85  STA ram_0304,X
CB88  INX
CB89  INY
CB8A  CPY #$07
CB8C  BNE bra_CB82_loop
CB8E  JSR sub_C94B
CB91  LDA #$20
CB93  LDX ram_004B
CB95  BNE bra_CB99
CB97  LDA #$31
bra_CB99:
CB99  STA ram_03AD
CB9C  CLC
CB9D  ADC #$03
bra_CB9F:
CB9F  STA ram_0033
CBA1  INC ram_0044
bra_CBA3_RTS:
CBA3  RTS
ofs_CBA4_02:
CBA4  LDA ram_0033
; bzk optimize, branch to 0x000BB1
CBA6  BEQ bra_CB9F
CBA8  CMP ram_03AD
CBAB  BEQ bra_CBC9
CBAD  BCS bra_CBA3_RTS
CBAF  LDA ram_004B
CBB1  BNE bra_CBB9
CBB3  LDA ram_btn_hold
CBB5  AND #con_btns_ABSS
CBB7  BNE bra_CBBF
bra_CBB9:
CBB9  JSR sub_CC15
CBBC  JMP loc_CC7D
bra_CBBF:
CBBF  JSR sub_CC6B
CBC2  LDA ram_0041
CBC4  BNE bra_CBA3_RTS
CBC6  JMP loc_C3AF
bra_CBC9:
CBC9  LDA ram_0020
CBCB  BNE bra_CBA3_RTS
CBCD  LDX #$03
CBCF  STX ram_002F
CBD1  STX ram_000D
CBD3  DEX
bra_CBD4_loop:
CBD4  LDA tbl_C0DE,X
CBD7  STA ram_0001
CBD9  LDA tbl_C0E2,X
CBDC  STA ram_0002
CBDE  LDA tbl_C0E5,X
CBE1  STA ram_000B
CBE3  JSR sub_CCCA
CBE6  DEX
CBE7  BPL bra_CBD4_loop
CBE9  LDA #$01
CBEB  LDX ram_0053
CBED  DEX
CBEE  STX ram_0000
CBF0  CPX #$03
CBF2  BCS bra_CBF8
CBF4  STX ram_000D
CBF6  LDA #$02
bra_CBF8:
CBF8  STA ram_00FB
CBFA  EOR #$02
CBFC  STA ram_0056
CBFE  LDX ram_000D
CC00  LDA tbl_C0DA,X
CC03  STA ram_0054
CC05  LDA tbl_C0DE,X
CC08  STA ram_0055
CC0A  STA ram_03F1
CC0D  LDA ram_0000
CC0F  BNE bra_CC6A_RTS
CC11  LDA #con_C27F_0A
CC13  BNE bra_CC2F    ; jmp
sub_CC15:
CC15  LDA ram_03AD
CC18  SEC
CC19  SBC #$10
CC1B  CMP ram_0033
CC1D  BNE bra_CC32
CC1F  LDA ram_0020
CC21  BNE bra_CC32
CC23  LDA #con_C27F_0D
CC25  LDY ram_0052
CC27  DEY
CC28  BNE bra_CC2F
CC2A  LDA ram_004B
CC2C  CLC
; con_C27F_0B
; con_C27F_0C
CC2D  ADC #$0B
bra_CC2F:
CC2F  STA ram_0045
CC31  RTS
bra_CC32:
CC32  LDA #$07
CC34  TAY
CC35  JSR sub_C971
CC38  STX ram_0005
bra_CC3A_loop:
CC3A  LDA tbl_C134,Y
CC3D  STA ram_0301,X
CC40  INX
CC41  DEY
CC42  BPL bra_CC3A_loop
CC44  LDA ram_003F
CC46  AND #$10
CC48  BNE bra_CC6A_RTS
CC4A  LDY ram_0005
CC4C  LDA ram_0053
CC4E  JSR sub_DFA2
CC51  STA ram_0307,Y
CC54  TXA
CC55  JSR sub_DFA2
CC58  STA ram_0000
CC5A  TXA
CC5B  BNE bra_CC62
CC5D  LDA ram_0000
CC5F  BNE bra_CC65
CC61  RTS
bra_CC62:
CC62  STA ram_0305,Y
bra_CC65:
CC65  LDA ram_0000
CC67  STA ram_0306,Y
bra_CC6A_RTS:
CC6A  RTS
loc_CC6B:
sub_CC6B:
ofs_CC6B_03:
CC6B  JSR sub_C3AF
CC6E  LDA ram_004B
CC70  BNE bra_CC7C_RTS
CC72  LDY ram_0041
CC74  CPY #$09
CC76  BCC bra_CC7A
CC78  LDA #$08
bra_CC7A:
CC7A  STA ram_0041
bra_CC7C_RTS:
CC7C  RTS
loc_CC7D:
CC7D  LDA ram_0055
CC7F  STA ram_0001
CC81  LDA ram_0056
CC83  BNE bra_CCB9
CC85  LDA ram_002F
CC87  BEQ bra_CCA3
CC89  LDA #$1F
CC8B  STA ram_0380
CC8E  STA ram_038C
CC91  LDA #$AF
CC93  STA ram_0378
CC96  LDA #$01
CC98  STA ram_037C
CC9B  LSR
CC9C  STA ram_0384
CC9F  LDY #$BD
CCA1  BNE bra_CCBB
bra_CCA3:
CCA3  LDX #$00
CCA5  JSR sub_DD6F
CCA8  STA ram_0055
CCAA  STA ram_0001
CCAC  LDA ram_03F1
CCAF  CMP ram_0055
CCB1  BCS bra_CCB9
CCB3  STA ram_0055
CCB5  LDA #$0A
CCB7  STA ram_002F
bra_CCB9:
CCB9  LDY #$BB
bra_CCBB:
CCBB  STY ram_0002
CCBD  LDX ram_0053
CCBF  DEX
CCC0  CPX #$03
CCC2  BCC bra_CCC6
CCC4  LDX #$03
bra_CCC6:
CCC6  LDA #$02
CCC8  STA ram_000B
sub_CCCA:
CCCA  LDA tbl_C0DA,X
CCCD  STA ram_0000
CCCF  LDA #$21
CCD1  STA ram_0003
CCD3  LDA tbl_C0E8,X
CCD6  STA ram_0004
CCD8  LDA #$00
CCDA  JMP loc_D1C7
loc_CCDD:
CCDD  LDA ram_003C
CCDF  LSR
CCE0  BCC bra_CD12_RTS
CCE2  LDA #$40
CCE4  STA ram_00FB
CCE6  LDA #$58
CCE8  STA ram_0000
CCEA  LDX #$08
bra_CCEC_loop:
CCEC  TXA
CCED  ASL
CCEE  ASL
CCEF  TAY
CCF0  LDA #$44
CCF2  STA ram_spr_Y + $C0,Y
CCF5  LDA tbl_C147,X
CCF8  STA ram_spr_T + $C0,Y
CCFB  LDA #$00
CCFD  STA ram_spr_A + $C0,Y
CD00  LDA ram_0000
CD02  STA ram_spr_X + $C0,Y
CD05  CLC
CD06  ADC #$0A
CD08  STA ram_0000
CD0A  DEX
CD0B  BPL bra_CCEC_loop
CD0D  LDA #$F8
CD0F  STA ram_spr_Y + $D0
bra_CD12_RTS:
CD12  RTS
loc_CD13:
CD13  LDX #$07
bra_CD15_loop:
CD15  LDA tbl_C150,X
CD18  STA ram_oam + $C0,X
CD1B  DEX
CD1C  BPL bra_CD15_loop
CD1E  RTS
sub_CD1F:
CD1F  LDA ram_004F
CD21  BEQ bra_CD40
CD23  LDX #$03
bra_CD25_loop:
CD25  LDA ram_00A8,X
CD27  BEQ bra_CD3D
CD29  LDA ram_009C,X
CD2B  CMP #$05
CD2D  BEQ bra_CD3A
CD2F  ORA ram_0098,X
CD31  ORA ram_03E0,X
CD34  BEQ bra_CD3A
CD36  LDA #$00
CD38  STA ram_005C,X
bra_CD3A:
CD3A  JSR sub_CD59
bra_CD3D:
CD3D  DEX
CD3E  BPL bra_CD25_loop
bra_CD40:
CD40  LDA ram_0034
CD42  BNE bra_CD58_RTS
CD44  LDA ram_005C
CD46  AND #$C0
CD48  BEQ bra_CD58_RTS
CD4A  LDA ram_03A9
CD4D  ORA ram_0052
CD4F  BNE bra_CD58_RTS
CD51  LDA #$01
CD53  STA ram_03A9
CD56  STA ram_00FE
bra_CD58_RTS:
CD58  RTS
sub_CD59:
CD59  LDA ram_005C,X
CD5B  AND #$03
CD5D  STA ram_000A
CD5F  LDY #$00
CD61  LDA ram_0374,X
CD64  ORA ram_0098,X
CD66  BNE bra_CDBA
CD68  LDA ram_009C,X
CD6A  BEQ bra_CD70
CD6C  CMP #$05
CD6E  BNE bra_CDBA
bra_CD70:
CD70  TXA
CD71  BNE bra_CD7B
CD73  LDY #$02
CD75  LDA ram_0052
CD77  BNE bra_CD9A
CD79  LDY #$00
bra_CD7B:
CD7B  LDA ram_00B0,X
CD7D  BNE bra_CDB2
CD7F  LDA ram_005C,X
CD81  AND #$C0
CD83  BEQ bra_CDBA
CD85  STX ram_0000
CD87  ASL
CD88  BCS bra_CD8C
CD8A  INC ram_0000
bra_CD8C:
CD8C  JSR sub_CDEE
CD8F  BEQ bra_CD95
CD91  LDA ram_0094,X
CD93  BNE bra_CDBA
bra_CD95:
CD95  LDY ram_0000
CD97  TXA
CD98  BNE bra_CDAC
bra_CD9A:
CD9A  LDA ram_0094,X
CD9C  CMP tbl_C0D1,Y
CD9F  BCC bra_CDAC
CDA1  BNE bra_CDB9
CDA3  LDA ram_0090,X
CDA5  CMP tbl_C0CE,Y
CDA8  BEQ bra_CDBD
CDAA  BCS bra_CDB9
bra_CDAC:
CDAC  JSR sub_CE29
CDAF  JMP loc_CDBD
bra_CDB2:
CDB2  LDY #$04
CDB4  LDA ram_000A
CDB6  BEQ bra_CDBA
CDB8  TAY
bra_CDB9:
CDB9  INY
bra_CDBA:
CDBA  JSR sub_CE58
bra_CDBD:
loc_CDBD:
CDBD  LDA ram_0098,X
CDBF  BNE bra_CE1C_RTS
CDC1  LDA ram_00B0,X
CDC3  BNE bra_CDD5
CDC5  LDA ram_0058,X
CDC7  ORA ram_0052
CDC9  BNE bra_CDDE
CDCB  LDA ram_0094,X
CDCD  BNE bra_CDD5
CDCF  LDA ram_0090,X
CDD1  CMP #$A0
CDD3  BCC bra_CDDE
bra_CDD5:
CDD5  LDA ram_000A
CDD7  BEQ bra_CDDE
CDD9  STA ram_0000
CDDB  JMP loc_CE83
bra_CDDE:
CDDE  LDA ram_00B0,X
CDE0  BNE bra_CE1C_RTS
CDE2  LDA ram_0368,X
CDE5  CMP ram_00AC,X
CDE7  BEQ bra_CE1C_RTS
CDE9  LDY #$05
CDEB  JMP loc_DCC7
sub_CDEE:
CDEE  LDA ram_00C0,X
CDF0  CMP #$E4
CDF2  BEQ bra_CE0A
CDF4  LDA #$03
CDF6  CMP ram_00A4,X
CDF8  BNE bra_CE00
CDFA  LDA ram_0070,X
CDFC  CMP #$03
CDFE  BCS bra_CE0A
bra_CE00:
CE00  LDA ram_00B8,X
CE02  CMP #$38
CE04  BCS bra_CE0A
CE06  CMP #$08
CE08  BCS bra_CE1D
bra_CE0A:
CE0A  LDA #$01
CE0C  CMP ram_036C,X
CE0F  BEQ bra_CE15
CE11  ASL
CE12  STA ram_036C,X
bra_CE15:
CE15  TXA
CE16  BNE bra_CE28_RTS
CE18  LDA #$04
CE1A  STA ram_00FD
bra_CE1C_RTS:
CE1C  RTS
bra_CE1D:
CE1D  LDA #$01
CE1F  CMP ram_036C,X
CE22  BEQ bra_CE28_RTS
CE24  LSR
CE25  STA ram_036C,X
bra_CE28_RTS:
CE28  RTS
sub_CE29:
CE29  CPX ram_004C
CE2B  BNE bra_CE45_RTS
CE2D  LDA tbl_C0BC,Y
CE30  CLC
CE31  ADC ram_0090,X
CE33  STA ram_0090,X
CE35  BCC bra_CE39
CE37  INC ram_0094,X
bra_CE39:
CE39  TXA
CE3A  BNE bra_CE45_RTS
CE3C  LDA ram_0094,X
CE3E  CMP tbl_C0D1,Y
CE41  BEQ bra_CE46
CE43  BCS bra_CE4D
bra_CE45_RTS:
CE45  RTS
bra_CE46:
CE46  LDA ram_0090,X
CE48  CMP tbl_C0CE,Y
CE4B  BCC bra_CE45_RTS
bra_CE4D:
CE4D  LDA tbl_C0CE,Y
CE50  STA ram_0090,X
CE52  LDA tbl_C0D1,Y
CE55  STA ram_0094,X
CE57  RTS
sub_CE58:
CE58  CPX ram_004C
CE5A  BNE bra_CE82_RTS
sub_CE5C:
CE5C  STY ram_0000
CE5E  LDA ram_0094,X
CE60  BNE bra_CE6D
CE62  LDA ram_00B0,X
CE64  LSR
CE65  TAY
CE66  LDA ram_0090,X
CE68  CMP tbl_C0CC,Y
CE6B  BCC bra_CE82_RTS
bra_CE6D:
CE6D  LDY ram_0000
CE6F  LDA ram_0090,X
CE71  SEC
CE72  SBC tbl_C0C1,Y
CE75  STA ram_0090,X
CE77  BCS bra_CE82_RTS
CE79  LDA ram_0094,X
CE7B  BEQ bra_CE80
CE7D  DEC ram_0094,X
CE7F  RTS
bra_CE80:
CE80  STA ram_0090,X
bra_CE82_RTS:
CE82  RTS
loc_CE83:
CE83  LDA ram_0026,X
CE85  BNE bra_CE9F_RTS
CE87  LDA ram_00B0,X
CE89  LSR
CE8A  TAY
CE8B  LDA tbl_C0D4,Y
CE8E  STA ram_0026,X
CE90  LSR ram_0000
CE92  BCC bra_CEA0
CE94  LDA ram_00AC,X
CE96  CMP tbl_C0C8,Y
CE99  BEQ bra_CE9F_RTS
CE9B  BCC bra_CEAF
CE9D  DEC ram_00AC,X
bra_CE9F_RTS:
CE9F  RTS
bra_CEA0:
CEA0  LDA ram_0388,X
CEA3  AND #$02
CEA5  STA ram_0388,X
CEA8  LDA ram_00AC,X
CEAA  CMP tbl_C0CA,Y
CEAD  BCS bra_CEB2
bra_CEAF:
CEAF  INC ram_00AC,X
CEB1  RTS
bra_CEB2:
CEB2  LDA ram_005C,X
CEB4  AND #$C0
CEB6  BEQ bra_CECF_RTS
CEB8  LDA ram_00B0,X
CEBA  BNE bra_CECF_RTS
CEBC  INC ram_00AC,X
CEBE  LDA #$0D
CEC0  STA ram_0026,X
CEC2  LDA ram_00AC,X
CEC4  CMP #$0D
CEC6  BCC bra_CECF_RTS
CEC8  LDA #$01
CECA  STA ram_0098,X
CECC  ASL
CECD  STA ram_0026,X
bra_CECF_RTS:
CECF  RTS
sub_CED0:
CED0  LDX ram_004A
bra_CED2_loop:
CED2  STX ram_000F
CED4  LDA ram_00A8,X
CED6  BEQ bra_CF04
CED8  LDA ram_0098,X
CEDA  ORA ram_009C,X
CEDC  BNE bra_CF04
CEDE  JSR sub_CFEA
CEE1  LDA ram_00B0,X
CEE3  BNE bra_CEFF
CEE5  JSR sub_CFCB
CEE8  JSR sub_D018
CEEB  BNE bra_CF04
CEED  LDA ram_03A6
CEF0  BEQ bra_CF04
CEF2  JSR sub_D000
CEF5  LDA ram_0052
CEF7  BNE bra_CF04
CEF9  JSR sub_CF0C
CEFC  JMP loc_CF04
bra_CEFF:
CEFF  LDA ram_0368,X
CF02  STA ram_007C,X
bra_CF04:
loc_CF04:
CF04  LDX ram_000F
CF06  INX
CF07  CPX #$04
CF09  BCC bra_CED2_loop
bra_CF0B_RTS:
CF0B  RTS
sub_CF0C:
CF0C  LDA ram_0084,X
CF0E  LSR
CF0F  BCC bra_CF0B_RTS
CF11  LDA ram_0070,X
CF13  STA ram_0002
CF15  LDY #$02
CF17  JSR sub_CF96
CF1A  BCC bra_CF2B
CF1C  JSR sub_CFDB
CF1F  LDA ram_0080,X
CF21  ASL
CF22  BCC bra_CF0B_RTS
CF24  LDA ram_0018,X
CF26  LSR
CF27  BCS bra_CF64
CF29  BCC bra_CF47_loop    ; jmp
bra_CF2B:
CF2B  LDA ram_00DC,X
CF2D  BNE bra_CF87_RTS
CF2F  LDA ram_0084,X
CF31  LSR
CF32  BCC bra_CF87_RTS
CF34  LDA ram_0080,X
CF36  CMP #$F0
CF38  BCS bra_CF87_RTS
CF3A  ASL
CF3B  BCC bra_CF87_RTS
CF3D  LDA ram_0019,X
CF3F  CMP #$E0
CF41  BCC bra_CF87_RTS
CF43  CMP #$F8
CF45  BCC bra_CF64
bra_CF47_loop:
sub_CF47:
CF47  LDY ram_0360,X
CF4A  DEY
CF4B  CPY #$01
CF4D  BMI bra_CF6A
CF4F  JSR sub_CF88
CF52  BCS bra_CF87_RTS
CF54  LDY ram_0070,X
CF56  INY
CF57  STY ram_0002
CF59  LDY #$00
CF5B  JSR sub_CF96
CF5E  BCS bra_CF87_RTS
CF60  LDA #$01
CF62  BNE bra_CF85    ; jmp
bra_CF64:
CF64  LDA ram_00C0,X
CF66  CMP #$E6
CF68  BEQ bra_CF47_loop
bra_CF6A:
sub_CF6A:
CF6A  LDY ram_0360,X
CF6D  INY
CF6E  CPY #$05
CF70  BPL bra_CF47_loop
CF72  JSR sub_CF88
CF75  BCS bra_CF87_RTS
CF77  LDY ram_0070,X
CF79  DEY
CF7A  STY ram_0002
CF7C  LDY #$00
CF7E  JSR sub_CF96
CF81  BCS bra_CF87_RTS
CF83  LDA #$FF
bra_CF85:
CF85  STA ram_00DC,X
bra_CF87_RTS:
CF87  RTS
sub_CF88:
CF88  JSR sub_E7FF
sub_CF8B:
CF8B  CMP #$3B
CF8D  BCC bra_CF94
CF8F  CMP #$3E
CF91  BCS bra_CF94
CF93  RTS
bra_CF94:
CF94  SEC
CF95  RTS
sub_CF96:
CF96  LDA ram_0080,X
CF98  CLC
CF99  ADC tbl_C0D6,Y
CF9C  STA ram_0000
CF9E  SEC
CF9F  SBC tbl_C0D6 + $01,Y
CFA2  STA ram_0001
CFA4  LDY ram_004A
bra_CFA6_loop:
CFA6  CPY ram_000F
CFA8  BEQ bra_CFC4
CFAA  LDA ram_0084,Y
CFAD  LSR
CFAE  BCC bra_CFC4
CFB0  LDA ram_0070,Y
CFB3  BEQ bra_CFC4
CFB5  CMP ram_0002
CFB7  BNE bra_CFC4
CFB9  LDA ram_0080,Y
CFBC  CMP ram_0000
CFBE  BCS bra_CFC4
CFC0  CMP ram_0001
CFC2  BCS bra_CFCA_RTS
bra_CFC4:
CFC4  INY
CFC5  CPY #$04
CFC7  BCC bra_CFA6_loop
CFC9  CLC
bra_CFCA_RTS:
CFCA  RTS
sub_CFCB:
CFCB  LDY #$80
CFCD  LDA ram_0094,X
CFCF  CMP ram_0078,X
CFD1  BCC bra_CFFA
CFD3  BNE bra_CFDB
CFD5  LDA ram_0090,X
CFD7  CMP ram_0074,X
CFD9  BCC bra_CFFA
bra_CFDB:
sub_CFDB:
CFDB  LDA ram_0094,X
CFDD  BEQ bra_CFE9_RTS
CFDF  LDA #$0F
CFE1  BNE bra_CFE5    ; jmp
sub_CFE3:
CFE3  LDA #$F0
bra_CFE5:
CFE5  AND ram_005C,X
CFE7  STA ram_005C,X
bra_CFE9_RTS:
CFE9  RTS
sub_CFEA:
CFEA  JSR sub_CFE3
CFED  LDY #$01
CFEF  LDA ram_007C,X
CFF1  BEQ bra_CFFF_RTS
CFF3  CMP ram_00AC,X
CFF5  BEQ bra_CFFF_RTS
CFF7  BCC bra_CFFA
CFF9  INY
bra_CFFA:
CFFA  TYA
CFFB  ORA ram_005C,X
CFFD  STA ram_005C,X
bra_CFFF_RTS:
CFFF  RTS
sub_D000:
D000  LDY #$00
D002  CPX #$03
D004  BEQ bra_D015
D006  LDA ram_0080,X
D008  AND #$10
D00A  BEQ bra_CFFF_RTS
D00C  LDA ram_001A,X
D00E  CMP #$C0
D010  BCC bra_CFFF_RTS
D012  BNE bra_D015
D014  INY
bra_D015:
D015  JMP loc_DB50
sub_D018:
D018  LDA #$00
D01A  STA ram_0009
D01C  STA ram_000D
D01E  TXA
D01F  ASL
D020  ASL
D021  STA ram_000A
D023  LDY #$03
bra_D025_loop:
D025  STY ram_000B
D027  LDY ram_000A
D029  LDA ram_03C0,Y
D02C  CMP #$C0
D02E  BEQ bra_D058
D030  CMP #$C1
D032  BEQ bra_D058
D034  CMP #$70
D036  BCC bra_D03C
D038  CMP #$74
D03A  BCC bra_D058
bra_D03C:
D03C  CMP #$48
D03E  BCC bra_D044
D040  CMP #$4B
D042  BCC bra_D0A4
bra_D044:
D044  INC ram_000A
D046  LDY ram_000B
D048  DEY
D049  BPL bra_D025_loop
bra_D04B:
loc_D04B:
D04B  LDY #$00
D04D  LDA ram_0058,X
D04F  BNE bra_D054
D051  LDY ram_0368,X
bra_D054:
D054  TYA
D055  JMP loc_D0A6
bra_D058:
D058  INC ram_000D
D05A  LDA ram_000A
D05C  AND #$03
D05E  TAY
D05F  INY
D060  TYA
D061  CLC
D062  ADC ram_00E0,X
D064  AND #$3F
D066  STA ram_0008
D068  LDA #$40
D06A  STA ram_0009
D06C  LDY ram_0360,X
bra_D06F_loop:
D06F  DEY
D070  CPY #$01
D072  BMI bra_D088
D074  JSR sub_E803
D077  LDY ram_0007
D079  CMP #$FA
D07B  BEQ bra_D088
D07D  JSR sub_CF8B
D080  BCS bra_D06F_loop
D082  JSR sub_CF47
D085  JMP loc_D04B
bra_D088:
D088  LDY ram_0360,X
bra_D08B_loop:
D08B  INY
D08C  CPY #$06
D08E  BPL bra_D04B
D090  JSR sub_E803
D093  LDY ram_0007
D095  CMP #$E4
D097  BEQ bra_D04B
D099  JSR sub_CF8B
D09C  BCS bra_D08B_loop
D09E  JSR sub_CF6A
D0A1  JMP loc_D04B
bra_D0A4:
D0A4  LDA #$09
loc_D0A6:
D0A6  STA ram_007C,X
D0A8  LDA ram_000D
D0AA  RTS
sub_D0AB:
D0AB  LDX #$03
bra_D0AD_loop:
D0AD  LDY #$05
D0AF  LDA ram_00B8,X
D0B1  SEC
D0B2  SBC #$10
D0B4  BMI bra_D0BE
bra_D0B6_loop:
D0B6  DEY
D0B7  BEQ bra_D0BE
D0B9  SEC
D0BA  SBC #$08
D0BC  BPL bra_D0B6_loop
bra_D0BE:
D0BE  TYA
D0BF  STA ram_0360,X
D0C2  DEX
D0C3  BPL bra_D0AD_loop
D0C5  RTS
sub_D0C6:
D0C6  LDX #$03
bra_D0C8_loop:
D0C8  TXA
D0C9  ASL
D0CA  ASL
D0CB  STA ram_000C
D0CD  LDA #$04
D0CF  STA ram_000B
D0D1  JSR sub_E7FC
D0D4  STA ram_00C0,X
D0D6  JMP loc_D0DD
bra_D0D9_loop:
D0D9  LDY ram_0008
D0DB  LDA (ram_0003),Y
loc_D0DD:
D0DD  PHA
D0DE  INY
D0DF  TYA
D0E0  AND #$3F
D0E2  STA ram_0008
D0E4  LDY ram_000C
D0E6  PLA
D0E7  STA ram_03C0,Y
D0EA  INC ram_000C
D0EC  DEC ram_000B
D0EE  BNE bra_D0D9_loop
D0F0  DEX
D0F1  BPL bra_D0C8_loop
D0F3  RTS
sub_D0F4:
D0F4  LDX #$06
bra_D0F6_loop:
D0F6  LDA ram_03D9,X
D0F9  STA ram_03D1,X
D0FC  DEX
D0FD  BPL bra_D0F6_loop
D0FF  LDA #$56
D101  STA ram_0000
D103  LDA #$23
D105  STA ram_0001
D107  LDA #$17
D109  STA ram_03D0
D10C  LDA #$D0
D10E  STA ram_0002
D110  LDA #$03
D112  STA ram_0003
D114  LDA #$FB
D116  STA ram_03D2
D119  STA ram_03D5
D11C  JMP loc_D2A3
sub_D11F:
D11F  LDA #$11
D121  STA ram_0300
D124  LDA #$23
D126  STA ram_0301
D129  LDA #$A0
D12B  STA ram_0302
D12E  LDX #$0E
D130  STX ram_0303
D133  LDA #$FE
bra_D135_loop:
D135  STA ram_0303,X
D138  DEX
D139  BNE bra_D135_loop
D13B  STX ram_0312
D13E  RTS
sub_D13F:
D13F  LDX #$00
D141  JSR sub_ECE4
D144  LDX #$04
D146  JSR sub_ECE4
D149  LDX #$08
D14B  JMP loc_ECE4
sub_D14E:
bra_D14E_infinite_loop:
D14E  LDA $2002
D151  AND #$40
D153  BNE bra_D14E_infinite_loop
D155  JSR sub_D1B3
D158  LDA ram_003F
D15A  AND #$03
D15C  STA ram_004C
D15E  JSR sub_D11F
D161  LDX #$43
D163  LDA ram_0041
D165  CMP #$09
D167  BEQ bra_D17E
D169  LDA #$F8
D16B  LDY #$EC
bra_D16D_loop:
D16D  STA ram_spr_Y,Y
D170  DEY
D171  DEY
D172  DEY
D173  DEY
D174  BNE bra_D16D_loop
D176  JSR sub_D0C6
D179  JSR sub_D0F4
D17C  LDX #$28
bra_D17E:
bra_D17E_garbage_loop:
D17E  LDY #$12
bra_D180_garbage_loop:
D180  DEY
D181  BNE bra_D180_garbage_loop
D183  DEX
D184  BNE bra_D17E_garbage_loop
D186  LDA ram_0010
D188  ORA ram_004D
D18A  STA $2000
D18D  LDA $2002
D190  LDA ram_scroll_X
D192  STA $2005
D195  LDA ram_scroll_Y
bra_D197:
loc_D197:
D197  STA $2005
D19A  RTS
loc_D19B:
sub_D19B:
bra_D19B_infinite_loop:
D19B  LDA $2002
D19E  AND #$40
D1A0  BEQ bra_D19B_infinite_loop
D1A2  LDA ram_0010
D1A4  AND #$F0
D1A6  JSR sub_C333
sub_D1A9:
D1A9  LDA $2002
D1AC  LDA #$00
D1AE  STA $2005
D1B1  BEQ bra_D197    ; jmp
sub_D1B3:
D1B3  LDA ram_0010
D1B5  ORA ram_004E
D1B7  STA $2000
D1BA  LDA $2002
D1BD  LDA ram_0050
D1BF  STA $2005
D1C2  LDA ram_0051
D1C4  JMP loc_D197
loc_D1C7:
sub_D1C7:
D1C7  STA ram_000A
D1C9  TXA
D1CA  PHA
D1CB  TYA
D1CC  PHA
D1CD  LDA #$02
D1CF  STA ram_0005
D1D1  LDA #$0F
D1D3  AND ram_0003
D1D5  STA ram_0007
D1D7  LDA ram_0003
D1D9  LSR
D1DA  LSR
D1DB  LSR
D1DC  LSR
D1DD  STA ram_0006
D1DF  TAX
D1E0  LDA #$00
D1E2  CLC
bra_D1E3_loop:
D1E3  ADC ram_0007
D1E5  DEX
D1E6  BNE bra_D1E3_loop
D1E8  STA ram_0008
D1EA  LDA ram_0002
D1EC  LDY #$01
bra_D1EE_loop:
D1EE  TXA
D1EF  LSR
D1F0  BCS bra_D1FC
D1F2  LSR ram_000A
D1F4  BCC bra_D1FC
D1F6  LDA #$FC
D1F8  STA (ram_0004),Y
D1FA  BNE bra_D202    ; jmp
bra_D1FC:
D1FC  LDA ram_0002
D1FE  STA (ram_0004),Y
D200  INC ram_0002
bra_D202:
D202  INY
D203  LDA ram_000B
D205  STA (ram_0004),Y
D207  INY
D208  INY
D209  INY
D20A  INX
D20B  CPX ram_0008
D20D  BNE bra_D1EE_loop
D20F  LDY #$00
bra_D211_loop:
D211  LDX ram_0006
D213  LDA ram_0001
D215  STA ram_0009
bra_D217_loop:
D217  LDA ram_0009
D219  STA (ram_0004),Y
D21B  CLC
D21C  ADC #$08
D21E  STA ram_0009
D220  INY
D221  INY
D222  INY
D223  LDA ram_0000
D225  STA (ram_0004),Y
D227  INY
D228  DEX
D229  BNE bra_D217_loop
D22B  LDA ram_0000
D22D  CLC
D22E  ADC #$08
D230  STA ram_0000
D232  DEC ram_0007
D234  BNE bra_D211_loop
D236  PLA
D237  TAY
D238  PLA
D239  TAX
D23A  RTS
sub_D23B:
D23B  LDX #$01
bra_D23D_loop:
D23D  TXA
D23E  PHA
D23F  STA ram_0001
D241  JSR sub_D24F_disable_rendering
D244  JSR sub_D260
D247  PLA
D248  TAX
D249  INX
D24A  CPX #$03
D24C  BCC bra_D23D_loop
D24E  RTS
sub_D24F_disable_rendering:
D24F  LDA #$00
D251  STA $2001
D254  RTS
sub_D255_hide_all_sprites:
D255  LDA #$F8
D257  LDY #$00
bra_D259_loop:
D259  STA ram_oam,Y
D25C  DEY
D25D  BNE bra_D259_loop
D25F  RTS
sub_D260:
D260  LDA $2002
D263  LDA ram_0010
D265  AND #$FB
D267  JSR sub_C333
D26A  LDA #$1C
D26C  CLC
bra_D26D_loop:
D26D  ADC #$04
D26F  DEC ram_0001
D271  BNE bra_D26D_loop
D273  STA ram_0002
D275  STA $2006
D278  LDA #$00
D27A  STA $2006
D27D  LDX #$04
D27F  LDY #$00
D281  LDA #$FC
bra_D283_loop:
D283  STA $2007
D286  DEY
D287  BNE bra_D283_loop
D289  DEX
D28A  BNE bra_D283_loop
D28C  LDA ram_0002
D28E  ADC #$03
D290  STA $2006
D293  LDA #$C0
D295  STA $2006
D298  LDY #$40
D29A  LDA #$00
bra_D29C_loop:
D29C  STA $2007
D29F  DEY
D2A0  BNE bra_D29C_loop
D2A2  RTS
loc_D2A3:
D2A3  TXA
D2A4  PHA
D2A5  TYA
D2A6  PHA
D2A7  LDY #$00
D2A9  LDA (ram_0002),Y
D2AB  AND #$0F
D2AD  STA ram_0005
D2AF  LDA (ram_0002),Y
D2B1  LSR
D2B2  LSR
D2B3  LSR
D2B4  LSR
D2B5  STA ram_0004
D2B7  LDX ram_0300
bra_D2BA_loop:
D2BA  LDA ram_0001
D2BC  STA ram_0301,X
D2BF  JSR sub_D2FF
D2C2  LDA ram_0000
D2C4  STA ram_0301,X
D2C7  JSR sub_D2FF
D2CA  LDA ram_0005
D2CC  STA ram_0006
D2CE  STA ram_0301,X
bra_D2D1_loop:
D2D1  JSR sub_D2FF
D2D4  INY
D2D5  LDA (ram_0002),Y
D2D7  STA ram_0301,X
D2DA  DEC ram_0006
D2DC  BNE bra_D2D1_loop
D2DE  JSR sub_D2FF
D2E1  STX ram_0300
D2E4  CLC
D2E5  LDA #$20
D2E7  ADC ram_0000
D2E9  STA ram_0000
D2EB  LDA #$00
D2ED  ADC ram_0001
D2EF  STA ram_0001
D2F1  DEC ram_0004
D2F3  BNE bra_D2BA_loop
D2F5  LDA #$00
D2F7  STA ram_0301,X
D2FA  PLA
D2FB  TAY
D2FC  PLA
D2FD  TAX
D2FE  RTS
sub_D2FF:
D2FF  INX
D300  TXA
D301  CMP #$3F
D303  BCC bra_D30F_RTS
D305  LDX ram_0300
D308  LDA #$00
D30A  STA ram_0301,X
D30D  PLA
D30E  PLA
bra_D30F_RTS:
D30F  RTS
sub_D310:
D310  LDX #$0E
D312  DEC ram_0020
D314  BPL bra_D31C
D316  LDA #$0A
D318  STA ram_0020
D31A  LDX #$1C
bra_D31C:
bra_D31C_loop:
D31C  LDA ram_0021,X
D31E  BEQ bra_D322
D320  DEC ram_0021,X
bra_D322:
D322  DEX
D323  BPL bra_D31C_loop
D325  RTS
sub_D326:
D326  LDA ram_0018
D328  AND #$02
D32A  STA ram_0000
D32C  LDA ram_0019
D32E  AND #$02
D330  EOR ram_0000
D332  CLC
D333  BEQ bra_D336
D335  SEC
bra_D336:
D336  ROR ram_0018
D338  ROR ram_0019
D33A  ROR ram_001A
D33C  ROR ram_001B
D33E  ROR ram_001C
D340  ROR ram_001D
D342  ROR ram_001E
D344  ROR ram_001F
D346  RTS
sub_D347_read_joy_regs:
D347  LDA #$01
D349  STA $4016
D34C  LDX #$00
D34E  LDA #$00
D350  STA $4016
D353  JSR sub_D35B
D356  INX
D357  JSR sub_D35B
D35A  RTS
sub_D35B:
D35B  LDY #$08
bra_D35D_loop:
D35D  PHA
D35E  LDA $4016,X
D361  STA ram_0000
D363  LSR
D364  ORA ram_0000
D366  LSR
D367  PLA
D368  ROL
D369  DEY
D36A  BNE bra_D35D_loop
D36C  STX ram_0000
D36E  ASL ram_0000
D370  LDX ram_0000
D372  LDY ram_btn_hold,X
D374  STY ram_0000
D376  STA ram_btn_hold,X
D378  STA ram_btn_press,X
D37A  AND #$FF
D37C  BPL bra_D386_RTS
D37E  BIT ram_0000
D380  BPL bra_D386_RTS
D382  AND #con_btn_A ^ $FF
D384  STA ram_btn_press,X
bra_D386_RTS:
D386  RTS
bra_D387_loop:
D387  STA $2006
D38A  INY
D38B  LDA (ram_0000),Y
D38D  STA $2006
D390  INY
D391  LDA (ram_0000),Y
D393  ASL
D394  PHA
D395  LDA ram_0010
D397  ORA #$04
D399  BCS bra_D39D
D39B  AND #$FB
bra_D39D:
D39D  JSR sub_C333
D3A0  PLA
D3A1  ASL
D3A2  BCC bra_D3A7
D3A4  ORA #$02
D3A6  INY
bra_D3A7:
D3A7  LSR
D3A8  LSR
D3A9  TAX
bra_D3AA_loop:
D3AA  BCS bra_D3AD
D3AC  INY
bra_D3AD:
D3AD  LDA (ram_0000),Y
D3AF  STA $2007
D3B2  DEX
D3B3  BNE bra_D3AA_loop
D3B5  SEC
D3B6  TYA
D3B7  ADC ram_0000
D3B9  STA ram_0000
D3BB  LDA #$00
D3BD  ADC ram_0001
D3BF  STA ram_0001
sub_D3C1:
D3C1  LDX $2002
D3C4  LDY #$00
D3C6  LDA (ram_0000),Y
D3C8  BNE bra_D387_loop
D3CA  LDA $2002
D3CD  LDA #$00
D3CF  STA $2005
D3D2  STA $2005
D3D5  RTS
con_40                                  = $40 ; 
con_80                                  = $80 ; 
con_C0                                  = $C0 ; 
_off_000_D3D6_12:
D3D6  .dbyt $3F00
D3D8  .byte $08   ; 
D3D9  .byte $29, $27, $22, $30   ; 
D3DD  .byte $29, $27, $18, $36   ; 
D3E1  .dbyt $3F10
D3E3  .byte $04   ; 
D3E4  .byte $29, $20, $16, $0F   ; 
D3E8  .byte $00   ; end token
_off_000_D3E9_13:
D3E9  .dbyt $3F00
D3EB  .byte $08   ; 
D3EC  .byte $01, $1A, $26, $33   ; 
D3F0  .byte $01, $11, $0C, $2C   ; 
D3F4  .dbyt $3F10
D3F6  .byte $04   ; 
D3F7  .byte $01, $20, $16, $0F   ; 
D3FB  .byte $00   ; end token
_off_000_D3FC_14:
D3FC  .dbyt $3F00
D3FE  .byte $08   ; 
D3FF  .byte $02, $26, $1C, $30   ; 
D403  .byte $02, $29, $19, $39   ; 
D407  .dbyt $3F10
D409  .byte $04   ; 
D40A  .byte $02, $20, $16, $0F   ; 
D40E  .byte $00   ; end token
_off_000_D40F_15:
D40F  .dbyt $3F00
D411  .byte $08   ; 
D412  .byte $00, $26, $22, $30   ; 
D416  .byte $00, $27, $18, $37   ; 
D41A  .dbyt $3F10
D41C  .byte $04   ; 
D41D  .byte $00, $20, $16, $0F   ; 
D421  .byte $00   ; end token
_off_000_D422_16:
D422  .dbyt $3F00
D424  .byte $08   ; 
D425  .byte $02, $19, $22, $30   ; 
D429  .byte $02, $00, $2D, $10   ; 
D42D  .dbyt $3F10
D42F  .byte $04   ; 
D430  .byte $02, $20, $16, $0F   ; 
D434  .byte $00   ; end token
_off_000_D435_17:
D435  .dbyt $3F08
D437  .byte $08   ; 
D438  .byte $29, $22, $0F, $20   ; 
D43C  .byte $29, $22, $0F, $16   ; 
D440  .dbyt $3F14
D442  .byte $0C   ; 
D443  .byte $29, $13, $20, $0F   ; 
D447  .byte $29, $31, $1C, $0F   ; 
D44B  .byte $29, $20, $19, $0F   ; 
D44F  .byte $00   ; end token
_off_000_D450_18:
D450  .dbyt $3F00
D452  .byte $1C   ; 
D453  .byte $02, $0F, $30, $21   ; 
D457  .byte $02, $15, $02, $2A   ; 
D45B  .byte $02, $3C, $02, $30   ; 
D45F  .byte $02, $30, $02, $27   ; 
D463  .byte $02, $20, $16, $0F   ; 
D467  .byte $02, $27, $13, $3C   ; 
D46B  .byte $02, $27, $16, $30   ; 
D46F  .byte $00   ; end token
_off_000_D470_01:
D470  .dbyt $23D0
D472  .byte $20 + con_40   ; 
D473  .byte $55   ; 
D474  .dbyt $23F0
D476  .byte $10 + con_40   ; 
D477  .byte $AA   ; 
D478  .dbyt $27D0
D47A  .byte $20 + con_40   ; 
D47B  .byte $55   ; 
D47C  .dbyt $27F0
D47E  .byte $10 + con_40   ; 
D47F  .byte $AA   ; 
D480  .dbyt $2000
D482  .byte $20 + con_40   ; 
D483  .byte $3F   ; 
D484  .dbyt $2020
D486  .byte $20 + con_40   ; 
D487  .byte $3E   ; 
D488  .dbyt $2040
D48A  .byte $20 + con_40   ; 
D48B  .byte $3F   ; 
D48C  .dbyt $2060
D48E  .byte $20 + con_40   ; 
D48F  .byte $3E   ; 
D490  .dbyt $2080
D492  .byte $20 + con_40   ; 
D493  .byte $3F   ; 
D494  .dbyt $2400
D496  .byte $20 + con_40   ; 
D497  .byte $3F   ; 
D498  .dbyt $2420
D49A  .byte $20 + con_40   ; 
D49B  .byte $3E   ; 
D49C  .dbyt $2440
D49E  .byte $20 + con_40   ; 
D49F  .byte $3F   ; 
D4A0  .dbyt $2460
D4A2  .byte $20 + con_40   ; 
D4A3  .byte $3E   ; 
D4A4  .dbyt $2480
D4A6  .byte $20 + con_40   ; 
D4A7  .byte $3F   ; 
D4A8  .dbyt $20A0
D4AA  .byte $20 + con_40   ; 
D4AB  .byte $30   ; 
D4AC  .dbyt $20C0
D4AE  .byte $20 + con_40   ; 
D4AF  .byte $FE   ; 
D4B0  .dbyt $20E0
D4B2  .byte $20 + con_40   ; 
D4B3  .byte $FE   ; 
D4B4  .dbyt $24A0
D4B6  .byte $20 + con_40   ; 
D4B7  .byte $30   ; 
D4B8  .dbyt $24C0
D4BA  .byte $20 + con_40   ; 
D4BB  .byte $FE   ; 
D4BC  .dbyt $24E0
D4BE  .byte $20 + con_40   ; 
D4BF  .byte $FE   ; 
D4C0  .dbyt $20AB
D4C2  .byte $03 + con_80   ; 
D4C3  .byte $31, $34, $37   ; 
D4C6  .dbyt $20B4
D4C8  .byte $03 + con_80   ; 
D4C9  .byte $33, $36, $39   ; 
D4CC  .dbyt $20AC
D4CE  .byte $08 + con_40   ; 
D4CF  .byte $32   ; 
D4D0  .dbyt $20EC
D4D2  .byte $08 + con_40   ; 
D4D3  .byte $38   ; 
D4D4  .dbyt $20CC
D4D6  .byte $08   ; 
D4D7  .byte $17, $12, $17, $1D, $0E, $17, $0D, $18   ; 
D4DF  .dbyt $2200
D4E1  .byte $20 + con_40   ; 
D4E2  .byte $3B   ; 
D4E3  .dbyt $2220
D4E5  .byte $20 + con_40   ; 
D4E6  .byte $3C   ; 
D4E7  .dbyt $2240
D4E9  .byte $20 + con_40   ; 
D4EA  .byte $3D   ; 
D4EB  .dbyt $2260
D4ED  .byte $20 + con_40   ; 
D4EE  .byte $3B   ; 
D4EF  .dbyt $2280
D4F1  .byte $20 + con_40   ; 
D4F2  .byte $3C   ; 
D4F3  .dbyt $22A0
D4F5  .byte $20 + con_40   ; 
D4F6  .byte $3D   ; 
D4F7  .dbyt $2600
D4F9  .byte $20 + con_40   ; 
D4FA  .byte $3B   ; 
D4FB  .dbyt $2620
D4FD  .byte $20 + con_40   ; 
D4FE  .byte $3C   ; 
D4FF  .dbyt $2640
D501  .byte $20 + con_40   ; 
D502  .byte $3D   ; 
D503  .dbyt $2660
D505  .byte $20 + con_40   ; 
D506  .byte $3B   ; 
D507  .dbyt $2680
D509  .byte $20 + con_40   ; 
D50A  .byte $3C   ; 
D50B  .dbyt $26A0
D50D  .byte $20 + con_40   ; 
D50E  .byte $3D   ; 
D50F  .dbyt $2300
D511  .byte $3F + con_40   ; 
D512  .byte $FE   ; 
D513  .dbyt $233F
D515  .byte $3F + con_40   ; 
D516  .byte $FE   ; 
D517  .dbyt $237E
D519  .byte $3F + con_40   ; 
D51A  .byte $FE   ; 
D51B  .dbyt $239D
D51D  .byte $23 + con_40   ; 
D51E  .byte $FE   ; 
D51F  .dbyt $2700
D521  .byte $3F + con_40   ; 
D522  .byte $FE   ; 
D523  .byte $00   ; end token
_off_000_D524_0E:
D524  .dbyt $24AB
D526  .byte $0A + con_40   ; 
D527  .byte $F2   ; 
D528  .dbyt $24AA
D52A  .byte $01   ; 
D52B  .byte $96   ; 
D52C  .dbyt $24B5
D52E  .byte $01   ; 
D52F  .byte $97   ; 
D530  .dbyt $24CB
D532  .byte $03   ; 
D533  .byte $93, $94, $95   ; 
D536  .dbyt $23F1
D538  .byte $06   ; 
D539  .byte $AF, $AA, $AE, $AB, $AA, $AF   ; 
D53F  .dbyt $2323
D541  .byte $07   ; 
D542  .byte $B7, $B7, $03, $1B, $0D, $B7, $B7   ; 
D549  .dbyt $2322
D54B  .byte $03 + con_80   ; 
D54C  .byte $B5, $B0, $B2   ; 
D54F  .dbyt $232A
D551  .byte $03 + con_80   ; 
D552  .byte $B6, $B1, $B4   ; 
D555  .dbyt $2363
D557  .byte $07 + con_40   ; 
D558  .byte $B3   ; 
D559  .dbyt $2336
D55B  .byte $07   ; 
D55C  .byte $B7, $B7, $1D, $12, $16, $0E, $B7   ; 
D563  .dbyt $2335
D565  .byte $03 + con_80   ; 
D566  .byte $B5, $B0, $B2   ; 
D569  .dbyt $233D
D56B  .byte $03 + con_80   ; 
D56C  .byte $B6, $B1, $B4   ; 
D56F  .dbyt $2376
D571  .byte $07 + con_40   ; 
D572  .byte $B3   ; 
D573  .dbyt $232C
D575  .byte $08   ; 
D576  .byte $4C, $5A, $1D, $0E, $16, $19, $7A, $8B   ; 
D57E  .dbyt $234B
D580  .byte $0A   ; 
D581  .byte $4B, $4D, $5B, $FC, $FC, $FC, $FC, $7B, $4D, $8C   ; 
D58B  .dbyt $236D
D58D  .byte $06   ; 
D58E  .byte $5C, $6A, $6A, $6A, $6A, $7C   ; 
D594  .dbyt $238D
D596  .byte $06   ; 
D597  .byte $5D, $6B, $6C, $6B, $6C, $8A   ; 
D59D  .byte $00   ; end token
_off_000_D59E_07:
D59E  .dbyt $2089
D5A0  .byte $0E + con_40   ; 
D5A1  .byte $FC   ; 
D5A2  .dbyt $20A9
D5A4  .byte $0E   ; 
D5A5  .byte $FC, $FC, $0E, $21, $0C, $12, $1D, $0E, $0B, $12, $14, $0E, $FC, $FC   ; 
D5B3  .byte $00   ; end token
_off_000_D5B4_08:
D5B4  .dbyt $2089
D5B6  .byte $0E + con_40   ; 
D5B7  .byte $FC   ; 
D5B8  .dbyt $20AA
D5BA  .byte $0C   ; 
D5BB  .byte $0D, $0E, $1C, $12, $10, $17, $FC, $1D, $1B, $0A, $0C, $14   ; 
D5C7  .byte $00   ; end token
_off_000_D5C8_0A:
D5C8  .dbyt $22E7
D5CA  .byte $12   ; 
D5CB  .byte $12, $1D, $F9, $1C, $FC, $0A, $FC, $17, $0E, $20, $FC, $1B, $0E, $0C, $18   ; 
D5DA  .byte $1B, $0D, $FA   ; 
D5DD  .byte $00   ; end token
_off_000_D5DE_0B:
D5DE  .dbyt $22E5
D5E0  .byte $16 + con_40   ; 
D5E1  .byte $FC   ; 
D5E2  .dbyt $22EB
D5E4  .byte $09   ; 
D5E5  .byte $10, $0A, $16, $0E, $FC, $18, $1F, $0E, $1B   ; 
D5EE  .byte $00   ; end token
_off_000_D5EF_0C:
D5EF  .dbyt $22E7
D5F1  .byte $12   ; 
D5F2  .byte $1D, $1B, $22, $FC, $1D, $11, $0E, $FC, $17, $0E, $21, $1D, $FC, $1D, $1B   ; 
D601  .byte $0A, $0C, $14   ; 
D604  .byte $00   ; end token
_off_000_D605_0D:
D605  .dbyt $22E5
D607  .byte $16 + con_40   ; 
D608  .byte $FC   ; 
D609  .dbyt $22EC
D60B  .byte $07   ; 
D60C  .byte $1D, $12, $16, $0E, $FC, $1E, $19   ; 
D613  .byte $00   ; end token
_off_000_D614_11:
D614  .dbyt $23E0
D616  .byte $10 + con_40   ; 
D617  .byte $FF   ; 
D618  .dbyt $220D
D61A  .byte $07   ; 
D61B  .byte $15, $18, $0A, $0D, $12, $17, $10   ; 
D622  .byte $00   ; end token
_off_000_D623_10:
D623  .dbyt $23E0
D625  .byte $10 + con_40   ; 
D626  .byte $FF   ; 
D627  .dbyt $220D
D629  .byte $06   ; 
D62A  .byte $1C, $0A, $1F, $12, $17, $10   ; 
D630  .byte $00   ; end token
_off_000_D631_19:
D631  .dbyt $228E
D633  .byte $05   ; 
D634  .byte $0E, $1B, $1B, $18, $1B   ; 
D639  .byte $00   ; end token
_off_000_D63A_06:
D63A  .dbyt $2184
D63C  .byte $18 + con_40   ; 
D63D  .byte $27   ; 
D63E  .dbyt $2344
D640  .byte $18 + con_40   ; 
D641  .byte $27   ; 
D642  .dbyt $21A4
D644  .byte $0D + con_C0   ; 
D645  .byte $27   ; 
D646  .dbyt $21BB
D648  .byte $0D + con_C0   ; 
D649  .byte $27   ; 
D64A  .byte $00   ; end token
_off_000_D64B_02:
D64B  .dbyt $23E3
D64D  .byte $0B + con_40   ; 
D64E  .byte $AA   ; 
D64F  .dbyt $23F2
D651  .byte $04 + con_40   ; 
D652  .byte $FF   ; 
D653  .dbyt $2083
D655  .byte $1A + con_40   ; 
D656  .byte $27   ; 
D657  .dbyt $20A3
D659  .byte $1A + con_40   ; 
D65A  .byte $27   ; 
D65B  .dbyt $2183
D65D  .byte $1A + con_40   ; 
D65E  .byte $27   ; 
D65F  .dbyt $21A3
D661  .byte $1A + con_40   ; 
D662  .byte $27   ; 
D663  .dbyt $20C3
D665  .byte $06 + con_C0   ; 
D666  .byte $27   ; 
D667  .dbyt $20C4
D669  .byte $06 + con_C0   ; 
D66A  .byte $27   ; 
D66B  .dbyt $20DB
D66D  .byte $06 + con_C0   ; 
D66E  .byte $27   ; 
D66F  .dbyt $20DC
D671  .byte $06 + con_C0   ; 
D672  .byte $27   ; 
D673  .dbyt $2107
D675  .byte $12   ; 
D676  .byte $98, $9A, $9C, $9E, $A0, $A2, $A4, $A6, $A8, $98, $9A, $98, $AA, $A4, $AC   ; 
D685  .byte $AE, $98, $9A   ; 
D688  .dbyt $2127
D68A  .byte $12   ; 
D68B  .byte $99, $9B, $9D, $9F, $A1, $A3, $A5, $A7, $A9, $99, $9B, $99, $AB, $A5, $AD   ; 
D69A  .byte $AF, $99, $9B   ; 
D69D  .dbyt $220C
D69F  .byte $0B   ; 
D6A0  .byte $1C, $0E, $15, $0E, $0C, $1D, $12, $18, $17, $FC, $0A   ; 
D6AB  .dbyt $224C
D6AD  .byte $0B   ; 
D6AE  .byte $1C, $0E, $15, $0E, $0C, $1D, $12, $18, $17, $FC, $0B   ; 
D6B9  .dbyt $228C
D6BB  .byte $06   ; 
D6BC  .byte $0D, $0E, $1C, $12, $10, $17   ; 
D6C2  .dbyt $2309
D6C4  .byte $0E   ; 
D6C5  .byte $3A, $01, $09, $08, $04, $FC, $17, $12, $17, $1D, $0E, $17, $0D, $18   ; 
D6D3  .byte $00   ; end token
_off_000_D6D4_03:
D6D4  .dbyt $23CA
D6D6  .byte $03   ; 
D6D7  .byte $40, $50, $50   ; 
D6DA  .dbyt $23D3
D6DC  .byte $02 + con_40   ; 
D6DD  .byte $55   ; 
D6DE  .dbyt $23E2
D6E0  .byte $04 + con_40   ; 
D6E1  .byte $AA   ; 
D6E2  .dbyt $20E6
D6E4  .byte $03 + con_40   ; 
D6E5  .byte $26   ; 
D6E6  .dbyt $20F7
D6E8  .byte $03 + con_40   ; 
D6E9  .byte $26   ; 
D6EA  .dbyt $20EB
D6EC  .byte $09   ; 
D6ED  .byte $0C, $11, $0A, $15, $15, $0E, $17, $10, $0E   ; 
D6F6  .dbyt $210D
D6F8  .byte $04   ; 
D6F9  .byte $1B, $0A, $0C, $0E   ; 
D6FD  .dbyt $220D
D6FF  .byte $06   ; 
D700  .byte $1D, $1B, $0A, $0C, $14, $79   ; 
D706  .dbyt $2269
D708  .byte $0D   ; 
D709  .byte $01, $FC, $FC, $02, $FC, $FC, $03, $FC, $FC, $04, $FC, $FC, $05   ; 
D716  .byte $00   ; end token
_off_000_D717_04:
D717  .dbyt $23C9
D719  .byte $06   ; 
D71A  .byte $0C, $07, $55, $55, $0D, $03   ; 
D720  .dbyt $23DA
D722  .byte $04 + con_40   ; 
D723  .byte $50   ; 
D724  .dbyt $23DE
D726  .byte $01   ; 
D727  .byte $10   ; 
D728  .dbyt $23E2
D72A  .byte $05   ; 
D72B  .byte $55, $55, $99, $AA, $22   ; 
D730  .dbyt $23E9
D732  .byte $01   ; 
D733  .byte $C0   ; 
D734  .dbyt $23EA
D736  .byte $04 + con_40   ; 
D737  .byte $F0   ; 
D738  .dbyt $23EE
D73A  .byte $01   ; 
D73B  .byte $30   ; 
D73C  .dbyt $2087
D73E  .byte $02   ; 
D73F  .byte $52, $54   ; 
D741  .dbyt $2097
D743  .byte $02   ; 
D744  .byte $52, $54   ; 
D746  .dbyt $20A4
D748  .byte $05   ; 
D749  .byte $26, $26, $FC, $53, $55   ; 
D74E  .dbyt $20B7
D750  .byte $05   ; 
D751  .byte $53, $55, $FC, $26, $26   ; 
D756  .dbyt $208B
D758  .byte $09   ; 
D759  .byte $0C, $11, $0A, $15, $15, $0E, $17, $10, $0E   ; 
D762  .dbyt $20AE
D764  .byte $04   ; 
D765  .byte $1B, $0A, $0C, $0E   ; 
D769  .dbyt $21E8
D76B  .byte $09   ; 
D76C  .byte $0B, $0E, $1C, $1D, $FC, $1D, $12, $16, $0E   ; 
D775  .dbyt $2228
D777  .byte $09   ; 
D778  .byte $22, $18, $1E, $1B, $FC, $1D, $12, $16, $0E   ; 
D781  .dbyt $2268
D783  .byte $07   ; 
D784  .byte $1B, $0A, $17, $14, $12, $17, $10   ; 
D78B  .dbyt $212F
D78D  .byte $01   ; 
D78E  .byte $42   ; 
D78F  .dbyt $214E
D791  .byte $03   ; 
D792  .byte $43, $44, $45   ; 
D795  .byte $00   ; end token
_off_000_D796_09:
D796  .dbyt $23CA
D798  .byte $04   ; 
D799  .byte $40, $50, $50, $10   ; 
D79D  .dbyt $23D3
D79F  .byte $02 + con_40   ; 
D7A0  .byte $AA   ; 
D7A1  .dbyt $23DB
D7A3  .byte $02   ; 
D7A4  .byte $AA, $22   ; 
D7A6  .dbyt $23E2
D7A8  .byte $03 + con_40   ; 
D7A9  .byte $55   ; 
D7AA  .dbyt $23EA
D7AC  .byte $03 + con_40   ; 
D7AD  .byte $55   ; 
D7AE  .dbyt $20E6
D7B0  .byte $03 + con_40   ; 
D7B1  .byte $26   ; 
D7B2  .dbyt $20F7
D7B4  .byte $03 + con_40   ; 
D7B5  .byte $26   ; 
D7B6  .dbyt $20EB
D7B8  .byte $0A   ; 
D7B9  .byte $0E, $21, $0C, $12, $1D, $0E, $0B, $12, $14, $0E   ; 
D7C3  .dbyt $218C
D7C5  .byte $07   ; 
D7C6  .byte $FC, $1D, $1B, $0A, $0C, $14, $FC   ; 
D7CD  .dbyt $216E
D7CF  .byte $03   ; 
D7D0  .byte $ED, $FC, $F0   ; 
D7D3  .dbyt $21AE
D7D5  .byte $03   ; 
D7D6  .byte $EE, $EF, $F1   ; 
D7D9  .dbyt $222B
D7DB  .byte $09   ; 
D7DC  .byte $0B, $0E, $1C, $1D, $FC, $1D, $12, $16, $0E   ; 
D7E5  .dbyt $226B
D7E7  .byte $03 + con_80   ; 
D7E8  .byte $B5, $B0, $B2   ; 
D7EB  .dbyt $2273
D7ED  .byte $03 + con_80   ; 
D7EE  .byte $B6, $B1, $B4   ; 
D7F1  .dbyt $226C
D7F3  .byte $07 + con_40   ; 
D7F4  .byte $B7   ; 
D7F5  .dbyt $22AC
D7F7  .byte $07 + con_40   ; 
D7F8  .byte $B3   ; 
D7F9  .byte $00   ; end token
_off_000_D7FA_0F:
D7FA  .dbyt $23CB
D7FC  .byte $0B + con_40   ; 
D7FD  .byte $55   ; 
D7FE  .dbyt $23DB
D800  .byte $02 + con_40   ; 
D801  .byte $F0   ; 
D802  .dbyt $23E3
D804  .byte $01   ; 
D805  .byte $FF   ; 
D806  .dbyt $23EB
D808  .byte $01   ; 
D809  .byte $FF   ; 
D80A  .dbyt $23F3
D80C  .byte $02 + con_40   ; 
D80D  .byte $0F   ; 
D80E  .dbyt $20CC
D810  .byte $0B   ; 
D811  .byte $19, $15, $0A, $22, $FC, $16, $18, $0D, $0E, $FC, $0A   ; 
D81C  .dbyt $212C
D81E  .byte $0B   ; 
D81F  .byte $19, $15, $0A, $22, $FC, $16, $18, $0D, $0E, $FC, $0B   ; 
D82A  .dbyt $21EC
D82C  .byte $06   ; 
D82D  .byte $0D, $0E, $1C, $12, $10, $17   ; 
D833  .dbyt $224C
D835  .byte $04   ; 
D836  .byte $1C, $0A, $1F, $0E   ; 
D83A  .dbyt $22AC
D83C  .byte $04   ; 
D83D  .byte $15, $18, $0A, $0D   ; 
D841  .dbyt $230C
D843  .byte $05   ; 
D844  .byte $1B, $0E, $1C, $0E, $1D   ; 
D849  .byte $00   ; end token
_off_000_D84A_05:
D84A  .dbyt $2323
D84C  .byte $18   ; 
D84D  .byte $0A, $0B, $0C, $0D, $0E, $0F, $10, $11, $12, $13, $14, $15, $16, $17, $18   ; 
D85C  .byte $19, $1A, $1B, $1C, $FE, $B8, $FE, $24, $25   ; 
D865  .byte $00   ; end token
; bzk garbage
D866  .byte $FF   ; 
D867  .byte $FF   ; 
tbl_D868:
D868  .byte $34   ; 00 
D869  .byte $34   ; 01 
D86A  .byte $18   ; 02 
D86B  .byte $34   ; 03 
tbl_D86C:
; 00 
D86C  .byte $03   ; 00 
D86D  .byte $02   ; 01 
D86E  .byte $03   ; 02 
D86F  .byte $02   ; 03 
D870  .byte $09   ; 04 
D871  .byte $06   ; 05 
D872  .byte $08   ; 06 
D873  .byte $0F   ; 07 
; 08 
D874  .byte $03   ; 00 
D875  .byte $02   ; 01 
D876  .byte $02   ; 02 
D877  .byte $02   ; 03 
D878  .byte $08   ; 04 
D879  .byte $05   ; 05 
D87A  .byte $07   ; 06 
D87B  .byte $0F   ; 07 
tbl_D87C:
; 00 
D87C  .byte $0C   ; 00 
D87D  .byte $09   ; 01 
D87E  .byte $0A   ; 02 
D87F  .byte $07   ; 03 
D880  .byte $0C   ; 04 
D881  .byte $0C   ; 05 
D882  .byte $0C   ; 06 
D883  .byte $00   ; 07 
; 08 
D884  .byte $0C   ; 00 
D885  .byte $0A   ; 01 
D886  .byte $0B   ; 02 
D887  .byte $08   ; 03 
D888  .byte $0C   ; 04 
D889  .byte $0C   ; 05 
D88A  .byte $0C   ; 06 
tbl_D88B:
D88B  .byte $06   ; 00 
D88C  .byte $03   ; 01 
D88D  .byte $04   ; 02 
D88E  .byte $02   ; 03 
D88F  .byte $0B   ; 04 
D890  .byte $08   ; 05 
D891  .byte $09   ; 06 
tbl_D892:
D892  .byte $58   ; 00 
D893  .byte $60   ; 01 
D894  .byte $69   ; 02 
D895  .byte $71   ; 03 
D896  .byte $79   ; 04 
D897  .byte $80   ; 05 
D898  .byte $0A   ; 06 
D899  .byte $18   ; 07 
D89A  .byte $20   ; 08 
D89B  .byte $28   ; 09 
D89C  .byte $30   ; 0A 
D89D  .byte $38   ; 0B 
D89E  .byte $40   ; 0C 
D89F  .byte $48   ; 0D 
D8A0  .byte $50   ; 0E 
D8A1  .byte $50   ; 0F 
D8A2  .byte $97   ; 10 
D8A3  .byte $90   ; 11 
D8A4  .byte $89   ; 12 
D8A5  .byte $11   ; 13 
D8A6  .byte $A6   ; 14 
D8A7  .byte $9F   ; 15 
D8A8  .byte $B3   ; 16 
tbl_D8A9:
D8A9  .byte $01   ; 00 
D8AA  .byte $00   ; 01 
D8AB  .byte $02   ; 02 
D8AC  .byte $02   ; 03 
D8AD  .byte $03   ; 04 
D8AE  .byte $00   ; 05 
D8AF  .byte $09   ; 06 
D8B0  .byte $08   ; 07 
D8B1  .byte $08   ; 08 
D8B2  .byte $10   ; 09 
D8B3  .byte $10   ; 0A 
D8B4  .byte $10   ; 0B 
D8B5  .byte $02   ; 0C 
D8B6  .byte $10   ; 0D 
D8B7  .byte $10   ; 0E 
D8B8  .byte $10   ; 0F 
D8B9  .byte $01   ; 10 
D8BA  .byte $09   ; 11 
D8BB  .byte $09   ; 12 
D8BC  .byte $09   ; 13 
D8BD  .byte $01   ; 14 
D8BE  .byte $09   ; 15 
D8BF  .byte $03   ; 16 
tbl_D8C0:
D8C0  .byte $04   ; 
D8C1  .byte $28   ; 
D8C2  .byte $4C   ; 
D8C3  .byte $70   ; 
tbl_D8C4:
D8C4  .byte $39   ; 00 
D8C5  .byte $01   ; 01 
D8C6  .byte $01   ; 02 
D8C7  .byte $01   ; 03 
D8C8  .byte $07   ; 04 
tbl_D8C9:
D8C9  .byte $00   ; 
D8CA  .byte $01   ; 
D8CB  .byte $01   ; 
D8CC  .byte $02   ; 
tbl_D8CD:
D8CD  .byte $00   ; 00 
D8CE  .byte $11   ; 01 
D8CF  .byte $22   ; 02 
D8D0  .byte $33   ; 03 
D8D1  .byte $44   ; 04 
D8D2  .byte $66   ; 05 
D8D3  .byte $88   ; 06 
D8D4  .byte $AA   ; 07 
tbl_D8D5:
D8D5  .byte $02   ; 00 
D8D6  .byte $01   ; 01 
D8D7  .byte $01   ; 02 
tbl_D8D8:
D8D8  .byte $0E   ; 01 
D8D9  .byte $1A   ; 02 
D8DA  .byte $26   ; 03 
D8DB  .byte $32   ; 04 
tbl_D8DC:
D8DC  .byte $00   ; 00 
D8DD  .byte $0C   ; 01 
D8DE  .byte $18   ; 02 
tbl_D8DF:
D8DF  .byte $A0   ; 00 
D8E0  .byte $40   ; 01 
D8E1  .byte $40   ; 02 
tbl_D8E2:
D8E2  .byte $ED   ; 00 
D8E3  .byte $21   ; 01 
D8E4  .byte $21   ; 02 
tbl_D8E5:
D8E5  .byte $E2   ; 00 
D8E6  .byte $E8   ; 01 
tbl_D8E7:
D8E7  .byte $9E   ; 00 
D8E8  .byte $A6   ; 01 
D8E9  .byte $92   ; 02 
D8EA  .byte $9A   ; 03 
D8EB  .byte $86   ; 04 
D8EC  .byte $8E   ; 05 
D8ED  .byte $7A   ; 06 
D8EE  .byte $82   ; 07 
tbl_D8EF_lo:
D8EF  .byte < ofs_004_E0E6_00   ; 
D8F0  .byte < ofs_004_E2AF_01   ; 
tbl_D8F1_hi:
D8F1  .byte > ofs_004_E0E6_00   ; 
D8F2  .byte > ofs_004_E2AF_01   ; 
tbl_D8F3:
D8F3  .byte $CF   ; 
D8F4  .byte $D3   ; 
D8F5  .byte $D7   ; 
D8F6  .byte $CF   ; 
tbl_D8F7:
D8F7  .byte $3F   ; 
D8F8  .byte $0F   ; 
D8F9  .byte $07   ; 
D8FA  .byte $07   ; 
tbl_D8FB:
D8FB  .byte $08   ; 
D8FC  .byte $20   ; 
D8FD  .byte $11   ; 
D8FE  .byte $11   ; 
tbl_D8FF_lo:
D8FF  .byte < ofs_003_D923_00_RTS   ; 
D900  .byte < ofs_003_D933_01   ; 
D901  .byte < ofs_003_D953_02   ; 
D902  .byte < ofs_003_D983_03   ; 
D903  .byte < ofs_003_D9D3_04   ; 
D904  .byte < ofs_003_D9F6_05   ; 
tbl_D905_hi:
D905  .byte > ofs_003_D923_00_RTS   ; 
D906  .byte > ofs_003_D933_01   ; 
D907  .byte > ofs_003_D953_02   ; 
D908  .byte > ofs_003_D983_03   ; 
D909  .byte > ofs_003_D9D3_04   ; 
D90A  .byte > ofs_003_D9F6_05   ; 
tbl_D90B:
D90B  .byte $BF   ; 
D90C  .byte $C3   ; 
D90D  .byte $C6   ; 
tbl_D90E:
D90E  .byte $08   ; 
D90F  .byte $0A   ; 
D910  .byte $0F   ; 
D911  .byte $14   ; 
D912  .byte $18   ; 
tbl_D913:
D913  .byte $08   ; 
D914  .byte $14   ; 
D915  .byte $20   ; 
D916  .byte $2C   ; 
D917  .byte $38   ; 
sub_D918:
D918  LDX #$03
bra_D91A_loop:
D91A  JSR sub_D924
D91D  JSR sub_DA15
D920  DEX
D921  BPL bra_D91A_loop
ofs_003_D923_00_RTS:
D923  RTS
sub_D924:
D924  LDY ram_009C,X
D926  LDA tbl_D8FF_lo,Y
D929  STA ram_0000
D92B  LDA tbl_D905_hi,Y
D92E  STA ram_0001
D930  JMP (ram_0000)
ofs_003_D933_01:
D933  LDA ram_0370,X
D936  BEQ bra_D94E
D938  LDA ram_003F
D93A  LSR
D93B  BCS bra_D952_RTS
D93D  INC ram_0390,X
D940  LDY ram_03E4,X
D943  LDA ram_0080,X
D945  CLC
D946  ADC tbl_D90E,Y
D949  CMP ram_0390,X
D94C  BCS bra_D952_RTS
bra_D94E:
D94E  INC ram_009C,X
D950  BNE bra_D97E
bra_D952_RTS:
D952  RTS
ofs_003_D953_02:
D953  TXA
D954  TAY
D955  BEQ bra_D95D
D957  LDA ram_00BC,X
D959  BEQ bra_D95D
D95B  LDY #$04
bra_D95D:
D95D  LDA ram_00B8,X
D95F  CMP tbl_D8C4,Y
D962  BEQ bra_D96E
D964  LDY #$01
D966  BCC bra_D96A
D968  LDY #$FF
bra_D96A:
D96A  TYA
D96B  STA ram_00DC,X
D96D  RTS
bra_D96E:
D96E  LDA #$00
D970  STA ram_0398,X
D973  STA ram_00DC,X
D975  INC ram_009C,X
D977  TXA
D978  BNE bra_D97E
D97A  LDA #$02
D97C  STA ram_00FD
bra_D97E:
D97E  LDA #$08
D980  STA ram_002A,X
D982  RTS
ofs_003_D983_03:
D983  LDA ram_0370,X
D986  BEQ bra_D9C0
D988  LDA ram_002A,X
D98A  BNE bra_D9D2_RTS
D98C  TXA
D98D  ORA ram_03F7
D990  BNE bra_D9A1
D992  LDY ram_0049
D994  LDA ram_btn_hold
D996  AND #con_btns_AB
D998  BEQ bra_D99F
D99A  STA ram_0049
D99C  TYA
D99D  BEQ bra_D9A7
bra_D99F:
D99F  STA ram_0049
bra_D9A1:
D9A1  LDA ram_003F
D9A3  AND #$0F
D9A5  BNE bra_D9AA
bra_D9A7:
D9A7  DEC ram_0390,X
bra_D9AA:
D9AA  AND #$07
D9AC  BNE bra_D9B6
D9AE  LDA ram_0398,X
D9B1  EOR #$01
D9B3  STA ram_0398,X
bra_D9B6:
D9B6  LDA ram_0390,X
D9B9  SEC
D9BA  SBC #$08
D9BC  CMP ram_0080,X
D9BE  BCS bra_D9D2_RTS
bra_D9C0:
D9C0  LDA #$03
D9C2  STA ram_0036,X
D9C4  INC ram_009C,X
D9C6  LDA #$00
D9C8  CPX #$03
D9CA  BNE bra_D9D2_RTS
D9CC  STA ram_03A8
D9CF  STA ram_0373
bra_D9D2_RTS:
D9D2  RTS
ofs_003_D9D3_04:
D9D3  LDA ram_0036,X
D9D5  BNE bra_D9F5_RTS
D9D7  TXA
D9D8  BNE bra_D9E7
D9DA  LDA ram_03E0
D9DD  BNE bra_DA10
D9DF  LDA ram_03F7
D9E2  BEQ bra_D9F3
D9E4  JMP loc_CA85
bra_D9E7:
D9E7  LDA ram_0022
D9E9  BNE bra_D9F5_RTS
D9EB  LDA #$01
D9ED  STA ram_00DC,X
D9EF  LDA #$18
D9F1  STA ram_0022
bra_D9F3:
D9F3  INC ram_009C,X
bra_D9F5_RTS:
D9F5  RTS
ofs_003_D9F6_05:
D9F6  LDA ram_0094,X
D9F8  ORA ram_00DC,X
D9FA  BNE bra_DA03
D9FC  LDA ram_00B8,X
D9FE  CMP tbl_D8C4,X
DA01  BEQ bra_DA14_RTS
bra_DA03:
DA03  LDA #$01
DA05  STA ram_00DC,X
DA07  TXA
DA08  BEQ bra_DA10
DA0A  LDA ram_00B8,X
DA0C  CMP #$08
DA0E  BCC bra_DA14_RTS
bra_DA10:
DA10  LDA #$00
DA12  STA ram_009C,X
bra_DA14_RTS:
DA14  RTS
sub_DA15:
DA15  LDA ram_0390,X
DA18  SEC
DA19  SBC ram_0080,X
DA1B  SBC #$08
DA1D  ASL
DA1E  CLC
DA1F  ADC ram_00B8,X
DA21  ADC #$04
DA23  STA ram_006C,X
DA25  RTS
sub_DA26:
DA26  LDA ram_004F
DA28  BEQ bra_DA69_RTS
DA2A  LDX #$03
bra_DA2C_loop:
DA2C  JSR sub_DA58
DA2F  JSR sub_DC1A
DA32  JSR sub_DCF2
DA35  JSR sub_DCDE
DA38  DEX
DA39  BPL bra_DA2C_loop
DA3B  JSR sub_DA6A
DA3E  JSR sub_DA7A
DA41  JSR sub_DBFE
DA44  LDA ram_003C
DA46  BNE bra_DA69_RTS
DA48  LDY ram_03BC
DA4B  LDA tbl_D8EF_lo,Y
DA4E  STA ram_0000
DA50  LDA tbl_D8F1_hi,Y
DA53  STA ram_0001
DA55  JMP (ram_0000)
sub_DA58:
DA58  LDA ram_0094,X
DA5A  STA ram_0060,X
DA5C  LDA ram_0090,X
DA5E  CLC
DA5F  ADC ram_0394,X
DA62  STA ram_0394,X
DA65  BCC bra_DA69_RTS
DA67  INC ram_0060,X
bra_DA69_RTS:
DA69  RTS
sub_DA6A:
DA6A  LDA ram_scroll_X
DA6C  CLC
DA6D  ADC ram_0060
DA6F  STA ram_scroll_X
DA71  BCC bra_DA79_RTS
DA73  LDA ram_004D
DA75  EOR #$01
DA77  STA ram_004D
bra_DA79_RTS:
DA79  RTS
sub_DA7A:
DA7A  LDX #$03
bra_DA7C_loop:
DA7C  LDA ram_00A8,X
DA7E  BEQ bra_DA9B
DA80  LDA ram_0060,X
DA82  CLC
DA83  ADC ram_0080,X
DA85  BCC bra_DA89
DA87  INC ram_0084,X
bra_DA89:
DA89  SEC
DA8A  SBC ram_0060
DA8C  STA ram_0080,X
DA8E  BCS bra_DA92
DA90  DEC ram_0084,X
bra_DA92:
DA92  LDA ram_0390,X
DA95  SEC
DA96  SBC ram_0060
DA98  STA ram_0390,X
bra_DA9B:
DA9B  DEX
DA9C  BNE bra_DA7C_loop
DA9E  RTS
sub_DA9F:
DA9F  LDX #$03
DAA1  LDA ram_003B
DAA3  BNE bra_DADF
bra_DAA5_loop:
DAA5  TXA
DAA6  EOR ram_004C
DAA8  ORA ram_00A8,X
DAAA  ORA ram_0023
DAAC  ORA ram_0373
DAAF  ORA ram_03A8
DAB2  BNE bra_DADF
DAB4  LDA ram_0018,X
DAB6  CMP #$A0
DAB8  BCC bra_DADF
DABA  STX ram_0000
DABC  AND #$03
DABE  TAY
DABF  INY
DAC0  LDA ram_0094
DAC2  AND #$02
DAC4  STA ram_0084,X
DAC6  LDX #$03
bra_DAC8_loop:
DAC8  STY ram_0001
DACA  LDA ram_0070,X
DACC  CMP ram_0001
DACE  BNE bra_DAD7
DAD0  INY
DAD1  CPY #$05
DAD3  BCC bra_DAD7
DAD5  LDY #$01
bra_DAD7:
DAD7  DEX
DAD8  BNE bra_DAC8_loop
DADA  LDX ram_0000
DADC  JSR sub_DAE3
bra_DADF:
DADF  DEX
DAE0  BNE bra_DAA5_loop
DAE2  RTS
sub_DAE3:
DAE3  JSR sub_DB95
DAE6  DEY
DAE7  LDA tbl_D8D8,Y
DAEA  STA ram_00B8,X
DAEC  LDY ram_0084,X
DAEE  LDA tbl_D8DF,Y
DAF1  STA ram_0080,X
DAF3  LDA #$06
DAF5  STA ram_00AC,X
DAF7  LDA ram_00E0
DAF9  CLC
DAFA  ADC tbl_D8E2,Y
DAFD  AND #$3F
DAFF  STA ram_00E0,X
DB01  LDA ram_0064
DB03  STA ram_0064,X
DB05  TYA
DB06  BEQ bra_DB34
DB08  LDY #$05
DB0A  JSR sub_E7FF
DB0D  CMP #$E4
DB0F  BEQ bra_DB34
DB11  CMP #$3B
DB13  BCC bra_DB4D
DB15  CMP #$93
DB17  BCS bra_DB4D
DB19  LDY #$02
DB1B  JSR sub_E7FF
DB1E  CMP #$E6
DB20  BNE bra_DB34
DB22  LDA ram_00B8,X
DB24  CMP #$20
DB26  BCC bra_DB30
DB28  LDA #$30
DB2A  STA ram_00BC,X
DB2C  LDA #$01
DB2E  BNE bra_DB32    ; jmp
bra_DB30:
DB30  LDA #$03
bra_DB32:
DB32  STA ram_00A4,X
bra_DB34:
DB34  LDY ram_0084,X
DB36  JSR sub_DB50
DB39  LDA ram_0084,X
DB3B  EOR #$02
DB3D  ASL
DB3E  STA ram_0094,X
DB40  LDA #$20
DB42  STA ram_039B,X
DB45  LSR
DB46  STA ram_0023
DB48  LDA #$01
DB4A  STA ram_00A8,X
DB4C  RTS
bra_DB4D:
DB4D  LDA #$00
DB4F  RTS
loc_DB50:
sub_DB50:
DB50  LDA ram_0052
DB52  BEQ bra_DB58
DB54  LDA #$03
DB56  BNE bra_DB5F    ; jmp
bra_DB58:
DB58  CPX #$03
DB5A  BEQ bra_DB6C
bra_DB5C:
DB5C  LDA tbl_D8D5,Y
bra_DB5F:
DB5F  STA ram_0078,X
DB61  LDA ram_001B,X
DB63  AND #$0F
DB65  TAY
DB66  LDA tbl_D8CD,Y
DB69  STA ram_0074,X
DB6B  RTS
bra_DB6C:
DB6C  LDA ram_0084,X
DB6E  LSR
DB6F  LSR
DB70  BCS bra_DB5C
DB72  LDA ram_0094
DB74  BEQ bra_DB5C
DB76  STA ram_0078,X
DB78  LDA ram_0090
DB7A  STA ram_0074,X
DB7C  LDA ram_0084,X
DB7E  BEQ bra_DB8C
DB80  LDA ram_0080,X
DB82  CMP #$40
DB84  BCS bra_DB5C
DB86  LDA ram_0070
DB88  CMP ram_0073
DB8A  BEQ bra_DB94_RTS
bra_DB8C:
DB8C  LDA ram_0078,X
DB8E  CMP #$04
DB90  BCS bra_DB94_RTS
DB92  INC ram_0078,X
bra_DB94_RTS:
DB94  RTS
sub_DB95:
loc_DB95:
DB95  LDA #$00
DB97  STA ram_00A8,X
DB99  STA ram_00B8,X
DB9B  STA ram_00BC,X
DB9D  STA ram_00A0,X
DB9F  STA ram_00A4,X
DBA1  STA ram_0058,X
DBA3  STA ram_00CC,X
DBA5  STA ram_036C,X
DBA8  STA ram_0090,X
DBAA  STA ram_0094,X
DBAC  STA ram_0098,X
DBAE  STA ram_009C,X
DBB0  STA ram_00B0,X
DBB2  STA ram_00D4,X
DBB4  STA ram_0388,X
DBB7  STA ram_00C0,X
DBB9  STA ram_039C,X
DBBC  STA ram_00DC,X
DBBE  STA ram_0070,X
DBC0  STA ram_0370,X
bra_DBC3_RTS:
DBC3  RTS
sub_DBC4:
DBC4  LDA ram_03A8
DBC7  BEQ bra_DBC3_RTS
DBC9  LDA ram_00AB
DBCB  BEQ bra_DBE0
DBCD  LDX #$03
DBCF  LDA ram_0084,X
DBD1  LSR
DBD2  BCS bra_DBC3_RTS
DBD4  LSR
DBD5  BCS bra_DBDD
DBD7  LDA ram_0080,X
DBD9  CMP #$EA
DBDB  BCS bra_DBC3_RTS
bra_DBDD:
DBDD  JMP loc_DB95
bra_DBE0:
DBE0  LDY #$00
DBE2  STY ram_03A8
DBE5  INY
DBE6  LDX #$02
DBE8  STX ram_0087
DBEA  INX
DBEB  JSR sub_DAE3
DBEE  BEQ bra_DBC3_RTS
DBF0  LDA #$00
DBF2  STA ram_0097
DBF4  LDA #$92
DBF6  STA ram_008F
DBF8  STA ram_0373
DBFB  JMP loc_DC69
sub_DBFE:
DBFE  LDA ram_0060
DC00  LSR
DC01  ROR
DC02  ROR
DC03  ROR
DC04  CLC
DC05  ADC ram_03BF
DC08  STA ram_03BF
DC0B  LDA ram_0060
DC0D  ADC ram_0050
DC0F  STA ram_0050
DC11  BCC bra_DC19_RTS
DC13  LDA ram_004E
DC15  EOR #$01
DC17  STA ram_004E
bra_DC19_RTS:
DC19  RTS
sub_DC1A:
DC1A  LDA ram_00B0,X
DC1C  BEQ bra_DC19_RTS
DC1E  JSR sub_DC97
DC21  STA ram_0001
DC23  CMP ram_008C,X
DC25  BCS bra_DC19_RTS
DC27  LDA ram_008C,X
DC29  CMP #$A8
DC2B  BCS bra_DC19_RTS
DC2D  LDA ram_0364,X
DC30  BEQ bra_DC19_RTS
DC32  TXA
DC33  BNE bra_DC39
DC35  LDA #$02
DC37  STA ram_00FF
bra_DC39:
DC39  LDA #$00
DC3B  STA ram_00B0,X
DC3D  STA ram_0364,X
DC40  LDA ram_0098,X
DC42  BNE bra_DC87
DC44  LDA ram_0052
DC46  BNE bra_DC8E
DC48  LDY ram_0388,X
DC4B  STA ram_0388,X
DC4E  TYA
DC4F  BNE bra_DC87
DC51  LDA ram_00D4,X
DC53  LDY ram_0094,X
DC55  CPY #$02
DC57  BPL bra_DC5C
DC59  CLC
DC5A  ADC #$08
bra_DC5C:
DC5C  TAY
DC5D  LDA ram_00AC,X
DC5F  CMP tbl_D86C,Y
DC62  BCC bra_DC69
DC64  CMP tbl_D87C,Y
DC67  BCC bra_DC6E
bra_DC69:
loc_DC69:
DC69  LDA #$FF
DC6B  STA ram_0098,X
DC6D  RTS
bra_DC6E:
DC6E  LDA ram_0368,X
DC71  CMP ram_00AC,X
DC73  BEQ bra_DC87
DC75  LDA ram_00D4,X
DC77  ORA ram_00CC,X
DC79  BNE bra_DC87
DC7B  LDA #$04
DC7D  STA ram_0374,X
DC80  LSR
DC81  STA ram_0388,X
DC84  LSR
DC85  STA ram_00B0,X
bra_DC87:
DC87  DEC ram_0001
DC89  LDA ram_0001
DC8B  STA ram_008C,X
bra_DC8D_RTS:
DC8D  RTS
bra_DC8E:
DC8E  LDA ram_00D4,X
DC90  BNE bra_DC8D_RTS
DC92  LDA #$06
DC94  STA ram_00AC,X
DC96  RTS
sub_DC97:
DC97  LDA ram_03F1
sub_DC9A:
DC9A  SEC
DC9B  SBC ram_00BC,X
DC9D  SBC ram_00B8,X
DC9F  RTS
sub_DCA0:
DCA0  LDY ram_00D4,X
DCA2  LDA ram_0052
DCA4  CMP #$01
DCA6  BNE bra_DCB5
DCA8  TXA
DCA9  ORA ram_0098
DCAB  ORA ram_009C
DCAD  ORA ram_0058
DCAF  BNE bra_DCB5
DCB1  LDA #$0A
DCB3  BNE bra_DCB8
bra_DCB5:
DCB5  LDA tbl_D88B,Y
bra_DCB8:
DCB8  STA ram_0368,X
DCBB  LDA ram_00A4,X
DCBD  CMP #$01
DCBF  BNE bra_DCC6_RTS
DCC1  LDA #$06
DCC3  STA ram_0368,X
bra_DCC6_RTS:
DCC6  RTS
loc_DCC7:
DCC7  STA ram_0000
DCC9  LDA ram_002A,X
DCCB  BNE bra_DCDD_RTS
DCCD  STY ram_002A,X
DCCF  LDA ram_00AC,X
DCD1  CMP ram_0000
DCD3  BEQ bra_DCDD_RTS
DCD5  BCC bra_DCDB
DCD7  DEC ram_00AC,X
DCD9  DEC ram_00AC,X
bra_DCDB:
DCDB  INC ram_00AC,X
bra_DCDD_RTS:
DCDD  RTS
sub_DCDE:
DCDE  LDA ram_0374,X
DCE1  BEQ bra_DCF1_RTS
DCE3  DEC ram_0374,X
DCE6  LDA ram_005C,X
DCE8  AND #$C0
DCEA  BEQ bra_DCF1_RTS
DCEC  LDA #$00
DCEE  STA ram_0374,X
bra_DCF1_RTS:
DCF1  RTS
sub_DCF2:
DCF2  LDA ram_00B0,X
DCF4  BEQ bra_DD37_RTS
DCF6  CMP #$02
DCF8  BEQ bra_DD11
bra_DCFA:
loc_DCFA:
DCFA  LDA #$00
DCFC  BEQ bra_DD08    ; jmp
loc_DCFE:
DCFE  LDA ram_0098,X
DD00  BNE bra_DCFA
DD02  INC ram_0094,X
DD04  BNE bra_DCFA    ; jmp?
loc_DD06:
sub_DD06:
DD06  LDA ram_0094,X
bra_DD08:
DD08  STA ram_0384,X
DD0B  JSR sub_DD38
DD0E  JMP loc_DD1A
bra_DD11:
DD11  LDA ram_005C,X
DD13  LSR
DD14  BCC bra_DD1A
DD16  LDA ram_004C
DD18  BEQ bra_DD37_RTS
bra_DD1A:
loc_DD1A:
DD1A  LDA ram_005C,X
DD1C  AND #$03
DD1E  TAY
DD1F  LDA tbl_D868,Y
DD22  STA ram_038C,X
DD25  LDA ram_008C,X
DD27  STA ram_0001
DD29  JSR sub_DD6F
DD2C  STA ram_008C,X
DD2E  LDA ram_00CC,X
DD30  BNE bra_DD37_RTS
DD32  LDA #$01
DD34  STA ram_0364,X
bra_DD37_RTS:
DD37  RTS
sub_DD38:
DD38  LDA #$02
DD3A  STA ram_00B0,X
DD3C  LDA #$0F
DD3E  STA ram_0380,X
DD41  LDA ram_0090,X
DD43  CLC
DD44  ADC #$AF
DD46  STA ram_0378,X
DD49  LDA ram_0094,X
DD4B  ADC #$00
DD4D  STA ram_037C,X
DD50  LDA ram_0388,X
DD53  CMP #$02
DD55  BNE bra_DD5D
DD57  LSR ram_037C,X
DD5A  ROR ram_0378,X
bra_DD5D:
DD5D  TXA
DD5E  BNE bra_DD6E_RTS
DD60  LDA ram_0094,X
DD62  ASL
DD63  ASL
DD64  ASL
DD65  ASL
DD66  EOR #$30
DD68  BNE bra_DD6C
DD6A  LDA #$08
bra_DD6C:
DD6C  STA ram_00FF
bra_DD6E_RTS:
DD6E  RTS
sub_DD6F:
DD6F  LDA ram_0380,X
DD72  ADC ram_038C,X
DD75  STA ram_0380,X
DD78  LDA ram_0384,X
DD7B  ADC #$00
DD7D  STA ram_0384,X
DD80  LDA ram_0001
DD82  SBC ram_037C,X
DD85  STA ram_0001
DD87  LDA ram_0001
DD89  ADC ram_0384,X
bra_DD8C_RTS:
DD8C  RTS
sub_DD8D:
DD8D  LDA ram_003C
DD8F  ORA ram_03E0
DD92  BEQ bra_DD8C_RTS
DD94  LDA ram_003C
DD96  CMP #$08
DD98  BEQ bra_DDBF
DD9A  BCC bra_DDCE
DD9C  LDA ram_0094
DD9E  ORA ram_0098
DDA0  ORA ram_009C
DDA2  BNE bra_DDBC
DDA4  LDA ram_0058
DDA6  BEQ bra_DDAE
DDA8  LDA #$C0
DDAA  STA ram_0090
DDAC  BNE bra_DDBC    ; jmp
bra_DDAE:
DDAE  STA ram_0090
DDB0  LDX #$01
DDB2  LDA ram_00B8
DDB4  CMP tbl_D8C4
DDB7  BNE bra_DDBA
DDB9  DEX
bra_DDBA:
DDBA  STX ram_00DC
bra_DDBC:
DDBC  JMP loc_CCDD
bra_DDBF:
DDBF  LDA #$00
DDC1  STA ram_03E0
DDC4  LDA #$05
DDC6  STA ram_03B6
DDC9  STA ram_009C
DDCB  STA ram_0374
bra_DDCE:
DDCE  JMP loc_CD13
sub_DDD1:
DDD1  LDX #$03
bra_DDD3_loop:
DDD3  LDA ram_0098,X
DDD5  BEQ bra_DE2D
DDD7  LDY #$04
DDD9  TXA
DDDA  BNE bra_DDEE
DDDC  STA ram_03A9
DDDF  STA ram_00FC
DDE1  LDA ram_004C
DDE3  BNE bra_DDE9
DDE5  LDA #$01
DDE7  STA ram_00FD
bra_DDE9:
DDE9  LDA ram_001B
DDEB  AND #$03
DDED  TAY
bra_DDEE:
DDEE  TYA
DDEF  STA ram_03E4,X
DDF2  LDA ram_004C
DDF4  LSR
DDF5  BCS bra_DE2D
DDF7  LDA ram_0094,X
DDF9  BNE bra_DE24
DDFB  LDA ram_00B0,X
DDFD  ORA ram_0058,X
DDFF  BNE bra_DE20
DE01  STA ram_0090,X
DE03  STA ram_0060,X
DE05  STA ram_0098,X
DE07  LDA #$06
DE09  STA ram_00AC,X
DE0B  LDA ram_0080,X
DE0D  CLC
DE0E  ADC #$08
DE10  STA ram_0390,X
DE13  JSR sub_DA15
DE16  LDA #$02
DE18  STA ram_0398,X
DE1B  LSR
DE1C  STA ram_009C,X
DE1E  BNE bra_DE2D
bra_DE20:
DE20  LDA #$88
DE22  STA ram_0090,X
bra_DE24:
DE24  LDA ram_00AC,X
DE26  CLC
DE27  ADC ram_0098,X
DE29  AND #$0F
DE2B  STA ram_00AC,X
bra_DE2D:
DE2D  DEX
DE2E  BPL bra_DDD3_loop
DE30  RTS
sub_DE31:
DE31  LDA ram_0024
DE33  CMP #$01
DE35  BEQ bra_DEA6
DE37  LDY ram_004F
DE39  BNE bra_DEA5_RTS
DE3B  CMP #$60
DE3D  BCS bra_DE4E
DE3F  LDA ram_03A9
DE42  BEQ bra_DE4E
DE44  LDA ram_005C
DE46  AND #$C0
DE48  BEQ bra_DE4E
DE4A  LDA #$01
DE4C  STA ram_00FE
bra_DE4E:
DE4E  LDY #$F0
DE50  LDA ram_0024
DE52  CMP #$10
DE54  BCS bra_DE5E
DE56  LDY #$F2
DE58  CMP #$08
DE5A  BCS bra_DE5E
DE5C  LDY #$F4
bra_DE5E:
DE5E  CMP #$72
DE60  BNE bra_DE66
DE62  LDA #$20
DE64  STA ram_00FB
bra_DE66:
DE66  STY ram_0000
DE68  LDA ram_03B4
DE6B  STA ram_0001
DE6D  LDY #$07
bra_DE6F_loop:
DE6F  TYA
DE70  ASL
DE71  ASL
DE72  TAX
DE73  LDA tbl_D8E7,Y
DE76  STA ram_spr_Y + $C0,X
DE79  LDA ram_0000
DE7B  STA ram_spr_T + $C0,X
DE7E  LDA #$00
DE80  STA ram_spr_A + $C0,X
DE83  LDA ram_0001
DE85  STA ram_spr_X + $C0,X
DE88  TYA
DE89  LSR
DE8A  BCC bra_DE91
DE8C  INC ram_spr_T + $C0,X
DE8F  BNE bra_DE9A
bra_DE91:
DE91  LDA ram_0001
DE93  SEC
DE94  SBC #$10
DE96  STA ram_0001
DE98  BCC bra_DE9D
bra_DE9A:
DE9A  DEY
DE9B  BPL bra_DE6F_loop
bra_DE9D:
DE9D  LDA ram_0034
DE9F  BEQ bra_DEA5_RTS
DEA1  LDA #$88
DEA3  STA ram_0024
bra_DEA5_RTS:
DEA5  RTS
bra_DEA6:
DEA6  LDA #$01
DEA8  STA ram_004F
DEAA  LDA ram_03B4
DEAD  SEC
DEAE  SBC ram_0060
DEB0  STA ram_03B4
DEB3  BCC bra_DEA5_RTS
DEB5  LDA #$02
DEB7  STA ram_0024
DEB9  BNE bra_DE4E    ; jmp
sub_DEBB:
DEBB  LDX #$03
bra_DEBD_loop:
DEBD  LDA ram_0084,X
DEBF  LSR
DEC0  BCC bra_DEDE
DEC2  LDA ram_0080,X
DEC4  CMP #$30
DEC6  BCC bra_DECC
DEC8  CMP #$40
DECA  BCC bra_DED9
bra_DECC:
DECC  LDA ram_03A9,X
DECF  BEQ bra_DEDE
DED1  LDA #$40
DED3  STA ram_00FF
DED5  LDA #$00
DED7  BEQ bra_DEDB    ; jmp
bra_DED9:
DED9  LDA #$01
bra_DEDB:
DEDB  STA ram_03A9,X
bra_DEDE:
DEDE  DEX
DEDF  BNE bra_DEBD_loop
DEE1  RTS
sub_DEE2:
DEE2  LDX #$00
DEE4  LDA ram_03A9
DEE7  BEQ bra_DF2D
DEE9  LDA ram_004C
DEEB  LSR
DEEC  BCS bra_DEA5_RTS
DEEE  LDX #$02
DEF0  LDA ram_0094
DEF2  STA ram_0000
DEF4  LDA ram_0090
DEF6  STA ram_0001
bra_DEF8_loop:
DEF8  LSR ram_0000
DEFA  ROR ram_0001
DEFC  DEX
DEFD  BPL bra_DEF8_loop
DEFF  LDA #$02
DF01  LDY ram_00B0
DF03  BEQ bra_DF07
DF05  LDA #$04
bra_DF07:
DF07  TAX
DF08  LDA ram_0001
DF0A  SEC
DF0B  SBC #$02
DF0D  BMI bra_DF15
DF0F  JSR sub_DFA4
DF12  TXA
DF13  BNE bra_DF17
bra_DF15:
DF15  LDX #$01
bra_DF17:
DF17  CPX #$2F
DF19  BCC bra_DF24
DF1B  LDX #$2F
DF1D  LDA ram_003F
DF1F  AND #$08
DF21  BNE bra_DF24
DF23  DEX
bra_DF24:
DF24  LDA ram_005C
DF26  ASL
DF27  BCS bra_DF2D
DF29  TXA
DF2A  ORA #$80
DF2C  TAX
bra_DF2D:
DF2D  STX ram_00FC
DF2F  RTS
sub_DF30:
DF30  LDA ram_004F
DF32  BEQ bra_DF51_RTS
DF34  LDA ram_006B
DF36  CLC
DF37  ADC #$10
DF39  STA ram_006B
bra_DF3B_loop:
DF3B  LDA ram_006B
DF3D  CMP #$0A
DF3F  BCS bra_DF52
bra_DF41:
DF41  LDX #$68
DF43  JSR sub_DF7F
DF46  LDX #$06
bra_DF48_loop:
DF48  LDA ram_03D1,X
DF4B  STA ram_03D9,X
DF4E  DEX
DF4F  BPL bra_DF48_loop
bra_DF51_RTS:
DF51  RTS
bra_DF52:
DF52  LDA ram_006B
DF54  SEC
DF55  SBC #$0A
DF57  STA ram_006B
DF59  INC ram_006A
DF5B  LDA ram_006A
DF5D  CMP #$64
DF5F  BCC bra_DF3B_loop
DF61  LDA #$00
DF63  STA ram_006A
DF65  INC ram_0069
DF67  LDA ram_0069
DF69  CMP #$3C
DF6B  BCC bra_DF3B_loop
DF6D  LDA #$00
DF6F  STA ram_0069
DF71  INC ram_0068
DF73  LDA ram_0068
DF75  CMP #$09
DF77  BCC bra_DF3B_loop
DF79  LDA #$02
DF7B  STA ram_0052
DF7D  BNE bra_DF41    ; jmp
sub_DF7F:
DF7F  LDA ram_0000,X
DF81  PHA
DF82  LDA ram_0001,X
DF84  PHA
DF85  LDA ram_0002,X
DF87  JSR sub_DFA2
DF8A  STX ram_03D6
DF8D  STA ram_03D7
DF90  PLA
DF91  JSR sub_DFA2
DF94  STX ram_03D3
DF97  STA ram_03D4
DF9A  PLA
DF9B  JSR sub_DFA2
DF9E  STA ram_03D1
DFA1  RTS
sub_DFA2:
DFA2  LDX #$0A
sub_DFA4:
DFA4  STX ram_000F
DFA6  LDX #$00
bra_DFA8_loop:
DFA8  INX
DFA9  SEC
DFAA  SBC ram_000F
DFAC  BPL bra_DFA8_loop
DFAE  DEX
DFAF  ADC ram_000F
DFB1  RTS
sub_DFB2:
DFB2  LDY #$00
DFB4  LDA ram_009C,X
DFB6  BNE bra_DFD1
DFB8  LDA ram_00B8,X
bra_DFBA_loop:
DFBA  CMP tbl_D913,Y
DFBD  BMI bra_DFC6
DFBF  INY
DFC0  CPY #$05
DFC2  BMI bra_DFBA_loop
DFC4  LDY #$00
bra_DFC6:
DFC6  TYA
DFC7  BEQ bra_DFD1
DFC9  LDA #$01
DFCB  CMP ram_00A4,X
DFCD  BNE bra_DFD1
DFCF  INY
DFD0  INY
bra_DFD1:
DFD1  TYA
DFD2  STA ram_0070,X
DFD4  RTS
sub_DFD5:
DFD5  LDX #$00
DFD7  LDY #$01
loc_DFD9:
DFD9  LDA ram_00A8,X
DFDB  BNE bra_DFE0
bra_DFDD:
DFDD  JMP loc_E086
bra_DFE0:
loc_DFE0:
DFE0  LDA ram_00A8,Y
DFE3  BEQ bra_E01D
DFE5  LDA ram_0084,X
DFE7  LSR
DFE8  BCC bra_DFDD
DFEA  LDA ram_0084,Y
DFED  LSR
DFEE  BCC bra_E01D
DFF0  LDA ram_0070,X
DFF2  BEQ bra_DFDD
DFF4  CMP ram_0070,Y
DFF7  BNE bra_E01D
DFF9  LDA ram_0098,X
DFFB  ORA ram_03E0,X
DFFE  BNE bra_DFDD
E000  LDA ram_0098,Y
E003  BNE bra_E07E
E005  LDA ram_00B0,X
E007  BNE bra_E00E
E009  LDA ram_00B0,Y
E00C  BEQ bra_E02A
bra_E00E:
E00E  LDA ram_008C,X
E010  CMP ram_008C,Y
E013  BCS bra_E020
E015  JSR sub_E091
E018  CMP ram_008C,Y
E01B  BCS bra_E02A
bra_E01D:
E01D  JMP loc_E07E
bra_E020:
E020  LDA ram_008C,Y
E023  JSR sub_E091
E026  CMP ram_008C,X
E028  BCC bra_E07E
bra_E02A:
E02A  LDA ram_0080,X
E02C  CMP ram_0080,Y
E02F  BCS bra_E045
E031  JSR sub_E098
E034  CMP ram_0080,Y
E037  BCS bra_E061
E039  LDA ram_0080,X
E03B  JSR sub_E091
E03E  CMP ram_0080,Y
E041  BCS bra_E05B
E043  BCC bra_E07E    ; jmp
bra_E045:
E045  LDA ram_0080,Y
E048  JSR sub_E098
E04B  CMP ram_0080,X
E04D  BCS bra_E061
E04F  LDA ram_0080,Y
E052  JSR sub_E091
E055  CMP ram_0080,X
E057  BCS bra_E065
E059  BCC bra_E07E    ; jmp
bra_E05B:
E05B  LDA #$FF
E05D  STA ram_0098,X
E05F  BNE bra_E076    ; jmp
bra_E061:
E061  LDA #$FF
E063  STA ram_0098,X
bra_E065:
E065  CPX #$00
E067  BNE bra_E071
E069  CPY #$03
E06B  BNE bra_E071
E06D  LDA #$10
E06F  STA ram_003B
bra_E071:
E071  LDA #$FF
E073  STA ram_0098,Y
bra_E076:
E076  CPX #$00
E078  BNE bra_E07E
E07A  LDA #$01
E07C  STA ram_00FD
bra_E07E:
loc_E07E:
E07E  INY
E07F  CPY #$04
E081  BEQ bra_E086
E083  JMP loc_DFE0
bra_E086:
loc_E086:
E086  INX
E087  TXA
E088  TAY
E089  INY
E08A  CPX #$03
E08C  BEQ bra_E097_RTS
E08E  JMP loc_DFD9
sub_E091:
E091  CMP #$E7
E093  BCS bra_E097_RTS
E095  ADC #$0C
bra_E097_RTS:
E097  RTS
sub_E098:
E098  CMP #$E7
E09A  BCS bra_E09E_RTS
E09C  ADC #$02
bra_E09E_RTS:
E09E  RTS
sub_E09F:
E09F  LDA ram_009C
E0A1  BNE bra_E0E5_RTS
E0A3  TAX
E0A4  LDA ram_0087
E0A6  LSR
E0A7  BCC bra_E0E5_RTS
E0A9  LDA ram_0373
E0AC  BEQ bra_E0E5_RTS
E0AE  LDA ram_00B8
E0B0  SEC
E0B1  SBC #$03
E0B3  CMP ram_006F
E0B5  BCS bra_E0E5_RTS
E0B7  ADC #$07
E0B9  CMP ram_006F
E0BB  BCC bra_E0E5_RTS
E0BD  LDA ram_0080
E0BF  CMP ram_0393
E0C2  BCS bra_E0E5_RTS
E0C4  ADC #$12
E0C6  CMP ram_0393
E0C9  BCC bra_E0E5_RTS
E0CB  JSR sub_DC97
E0CE  SEC
E0CF  SBC #$08
E0D1  CMP ram_008C
E0D3  BCS bra_E0E5_RTS
E0D5  LDY #$FF
E0D7  STY ram_0098
E0D9  INY
E0DA  STY ram_00DF
E0DC  INY
E0DD  STY ram_009F
E0DF  STY ram_00FD
E0E1  INY
E0E2  STY ram_039B
bra_E0E5_RTS:
E0E5  RTS
ofs_004_E0E6_00:
E0E6  LDA ram_003A
E0E8  ORA ram_0052
E0EA  ORA ram_0024
E0EC  BNE bra_E09E_RTS
E0EE  LDA ram_03A0
E0F1  BNE bra_E10A
E0F3  LDA ram_002E
E0F5  BNE bra_E09E_RTS
E0F7  LDA ram_0018
E0F9  AND #$03
E0FB  TAX
E0FC  LDA tbl_D8F3,X
E0FF  STA ram_03A1
E102  LDA #$F8
E104  STA ram_03B9
E107  STA ram_03A0
bra_E10A:
E10A  LDA #$50
E10C  STA ram_0001
E10E  LDA ram_03B9
E111  SEC
E112  SBC ram_0060
E114  STA ram_03B9
E117  LDA ram_0060
E119  BEQ bra_E124
E11B  LDA ram_003F
E11D  AND #$0F
E11F  BNE bra_E124
E121  DEC ram_03B9
bra_E124:
E124  LDA ram_03B9
E127  STA ram_0000
E129  CMP #$FC
E12B  BCC bra_E139
E12D  LDA ram_0018
E12F  AND #$A0
E131  STA ram_002E
E133  LDA #$00
E135  STA ram_03A0
E138  RTS
bra_E139:
E139  LDA ram_03A1
E13C  STA ram_0002
E13E  LDA #$22
E140  STA ram_0003
E142  LDA #$C0
E144  STA ram_0004
E146  LDA #$20
E148  STA ram_000B
E14A  JSR sub_D1C7
E14D  LDA ram_03B9
E150  CMP #$60
E152  BCS bra_E17E_RTS
E154  LDX ram_03A1
E157  INX
E158  INX
E159  INX
E15A  STX ram_0000
E15C  JSR sub_E16C
E15F  LDX ram_03A1
E162  INX
E163  STX ram_0000
E165  LDA ram_0004
E167  CLC
E168  ADC #$08
E16A  STA ram_0004
sub_E16C:
E16C  LDY #$06
bra_E16E_loop:
E16E  LDA #$60
E170  STA (ram_0004),Y
E172  DEY
E173  LDA ram_0000
E175  STA (ram_0004),Y
E177  DEC ram_0000
E179  DEY
E17A  DEY
E17B  DEY
E17C  BPL bra_E16E_loop
bra_E17E_RTS:
E17E  RTS
sub_E17F:
E17F  JSR sub_E3F4
E182  LDX #$03
bra_E184_loop:
E184  STX ram_000D
E186  LDA tbl_D8C0,X
E189  STA ram_0004
E18B  LDA ram_0088,X
E18D  TAX
E18E  LDA ram_00A8,X
E190  BEQ bra_E19D
E192  LDA tbl_D8C9,X
E195  STA ram_000B
E197  JSR sub_E1A3
E19A  JSR sub_E26A
bra_E19D:
E19D  LDX ram_000D
E19F  DEX
E1A0  BPL bra_E184_loop
E1A2  RTS
sub_E1A3:
E1A3  LDA ram_0080,X
E1A5  STA ram_0000
E1A7  LDA ram_008C,X
E1A9  STA ram_0001
E1AB  JSR sub_E1F9
E1AE  TAY
E1AF  LDA tbl_D892,Y
E1B2  STA ram_0002
E1B4  LDA #$33
E1B6  STA ram_0003
E1B8  CPY #$16
E1BA  BNE bra_E1D1
E1BC  LDA ram_0004
E1BE  STA ram_039F
E1C1  CLC
E1C2  ADC #$0C
E1C4  STA ram_0004
E1C6  LDA ram_0001
E1C8  CLC
E1C9  ADC #$08
E1CB  STA ram_0001
E1CD  LDA #$23
E1CF  STA ram_0003
bra_E1D1:
E1D1  LDA tbl_D8A9,Y
E1D4  JSR sub_D1C7
E1D7  LDA ram_000E
E1D9  BEQ bra_E1F8_RTS
E1DB  LSR
E1DC  BCS bra_E1F2
E1DE  LDY #$11
E1E0  LDA #$B2
bra_E1E2_loop:
E1E2  CPY #$09
E1E4  BEQ bra_E1EB
E1E6  STA (ram_0004),Y
E1E8  SEC
E1E9  SBC #$01
bra_E1EB:
E1EB  DEY
E1EC  DEY
E1ED  DEY
E1EE  DEY
E1EF  BPL bra_E1E2_loop
E1F1  RTS
bra_E1F2:
E1F2  LDY #$15
E1F4  LDA #$AE
E1F6  STA (ram_0004),Y
bra_E1F8_RTS:
E1F8  RTS
sub_E1F9:
E1F9  LDA #$00
E1FB  STA ram_000E
E1FD  STA ram_039F
E200  LDA ram_009C,X
E202  BEQ bra_E21F
E204  CMP #$05
E206  BEQ bra_E21F
E208  LDY #$06
E20A  LDA ram_00BC,X
E20C  BNE bra_E213
E20E  LDA ram_0370,X
E211  BNE bra_E215
bra_E213:
E213  LDY #$02
bra_E215:
E215  TYA
E216  LDY ram_0036,X
E218  BEQ bra_E21C
E21A  DEY
E21B  TYA
bra_E21C:
E21C  ORA #$10
E21E  RTS
bra_E21F:
E21F  LDY ram_0052
E221  DEY
E222  BNE bra_E22F
E224  LDA ram_00AC,X
E226  CMP #$0A
E228  BNE bra_E22F
E22A  LDY #$02
E22C  STY ram_000E
E22E  RTS
bra_E22F:
E22F  LDA ram_0098,X
E231  ORA ram_00B0,X
E233  BNE bra_E267
E235  LDA ram_0058,X
E237  BEQ bra_E243
E239  CMP #$0D
E23B  BNE bra_E267
E23D  LDA ram_00B8,X
E23F  CMP #$20
E241  BCC bra_E267
bra_E243:
E243  LDA ram_0090,X
E245  ORA ram_0094,X
E247  BNE bra_E24D
E249  INC ram_000E
E24B  BNE bra_E267
bra_E24D:
E24D  LDA ram_00AC,X
E24F  CMP #$06
E251  BNE bra_E267
E253  LDY #$14
E255  LDA ram_00DC,X
E257  BEQ bra_E25E
E259  BPL bra_E25C
E25B  INY
bra_E25C:
E25C  TYA
E25D  RTS
bra_E25E:
E25E  LDA ram_003F
E260  AND #$02
E262  BEQ bra_E267
E264  LDA #$13
E266  RTS
bra_E267:
E267  LDA ram_00AC,X
bra_E269_RTS:
E269  RTS
sub_E26A:
E26A  LDA ram_039F
E26D  BEQ bra_E269_RTS
E26F  LDA ram_0084,X
E271  CMP #$02
E273  BEQ bra_E269_RTS
E275  LDA ram_0390,X
E278  CMP #$F8
E27A  BCS bra_E269_RTS
E27C  CMP ram_0080,X
E27E  BCC bra_E269_RTS
E280  LDA ram_0390,X
E283  STA ram_0000
E285  LDA #$A8
E287  SEC
E288  SBC ram_006C,X
E28A  STA ram_0001
E28C  LDA #$22
E28E  STA ram_0003
E290  LDA ram_039F
E293  STA ram_0004
E295  LDA ram_00A4,X
E297  BEQ bra_E29B
E299  LDA #$20
bra_E29B:
E29B  ORA ram_000B
E29D  STA ram_000B
E29F  LDY ram_0398,X
E2A2  LDA tbl_D90B,Y
E2A5  STA ram_0002
E2A7  TYA
E2A8  BEQ bra_E2AC
E2AA  EOR #$03
bra_E2AC:
E2AC  JMP loc_D1C7
ofs_004_E2AF_01:
E2AF  LDA ram_03BD
E2B2  SEC
E2B3  SBC ram_0060
E2B5  STA ram_03BD
E2B8  BCS bra_E2BD
E2BA  DEC ram_03BE
bra_E2BD:
E2BD  LDY ram_0052
E2BF  BEQ bra_E2D0
E2C1  DEY
E2C2  BNE bra_E269_RTS
E2C4  LDA ram_0020
E2C6  BNE bra_E2D0
E2C8  LDA ram_03BB
E2CB  EOR #$01
E2CD  STA ram_03BB
bra_E2D0:
E2D0  LDY ram_03BE
E2D3  DEY
E2D4  BNE bra_E303
E2D6  LDA ram_03BD
E2D9  STA ram_0000
E2DB  LDA #$50
E2DD  STA ram_0001
E2DF  LDY ram_03BB
E2E2  LDA tbl_D8E5,Y
E2E5  STA ram_0002
E2E7  LDA #$32
E2E9  STA ram_0003
E2EB  LDA #$C0
E2ED  STA ram_0004
E2EF  LDA #$00
E2F1  STA ram_000B
E2F3  JMP loc_D1C7
sub_E2F6:
E2F6  LDA ram_036C,X
E2F9  BEQ bra_E358_RTS
E2FB  LDA ram_0094,X
E2FD  ORA ram_0090,X
E2FF  BEQ bra_E358_RTS
E301  LDA ram_00BC,X
bra_E303:
E303  BNE bra_E358_RTS
E305  LDA ram_0084,X
E307  LSR
E308  BCC bra_E358_RTS
E30A  LDA ram_0080,X
E30C  CMP #$10
E30E  BCC bra_E358_RTS
E310  CLC
E311  ADC #$F9
E313  STA ram_spr_X + $94,Y
E316  CLC
E317  ADC #$F8
E319  STA ram_spr_X + $98,Y
E31C  LDA ram_008C,X
E31E  CLC
E31F  ADC #$08
E321  STA ram_spr_Y + $98,Y
E324  CLC
E325  ADC #$08
E327  STA ram_spr_Y + $94,Y
E32A  LDA #$F6
E32C  STA ram_spr_T + $94,Y
E32F  LDA #$F7
E331  STA ram_spr_T + $98,Y
E334  LDA ram_003F
E336  AND #$04
E338  BEQ bra_E344
E33A  LDA #$F7
E33C  STA ram_spr_T + $94,Y
E33F  LDA #$F6
E341  STA ram_spr_T + $98,Y
bra_E344:
E344  LDA ram_036C,X
E347  AND #$02
E349  STA ram_spr_A + $94,Y
E34C  STA ram_spr_A + $98,Y
E34F  LDA ram_0094,X
E351  BNE bra_E358_RTS
E353  LDA #$F8
E355  STA ram_spr_Y + $98,Y
bra_E358_RTS:
E358  RTS
sub_E359:
E359  LDA ram_0052
E35B  BNE bra_E3C6
E35D  LDA ram_03E0
E360  BEQ bra_E36B
E362  LDA ram_003C
E364  LSR
E365  BCS bra_E3C6
E367  LDA #$FC
E369  BNE bra_E3C8
bra_E36B:
E36B  LDA ram_005C
E36D  AND #$C0
E36F  BEQ bra_E37A
E371  LDY ram_004F
E373  BNE bra_E377
E375  LDA #$80
bra_E377:
E377  ASL
E378  ROL
E379  ROL
bra_E37A:
E37A  TAY
E37B  LDA ram_03B6
E37E  CMP tbl_D8FB,Y
E381  BCC bra_E39B
E383  BEQ bra_E3AA
E385  LDA ram_03B5
E388  SEC
E389  SBC #$0B
E38B  STA ram_03B5
E38E  BCS bra_E3AA
E390  LDA ram_03B6
E393  BEQ bra_E3AA
E395  DEC ram_03B6
E398  JMP loc_E3AA
bra_E39B:
E39B  LDA ram_03B5
E39E  CLC
E39F  ADC tbl_D8F7,Y
E3A2  STA ram_03B5
E3A5  BCC bra_E3AA
E3A7  INC ram_03B6
bra_E3AA:
loc_E3AA:
E3AA  LDX #$00
E3AC  LDA ram_03B6
E3AF  CMP #$20
E3B1  BCC bra_E3B8
E3B3  STA ram_003C
E3B5  STA ram_03E0
bra_E3B8:
E3B8  CMP #$1A
E3BA  BCC bra_E3C1
E3BC  DEY
E3BD  BNE bra_E3C1
E3BF  LDX #$B0
bra_E3C1:
E3C1  TXA
E3C2  ORA ram_00FC
E3C4  STA ram_00FC
bra_E3C6:
E3C6  LDA #$FE
bra_E3C8:
E3C8  STA ram_0001
E3CA  LDA ram_03B6
E3CD  CLC
E3CE  ADC #$50
E3D0  STA ram_0000
E3D2  LDX #$0C
bra_E3D4_loop:
E3D4  LDA #$CF
E3D6  STA ram_spr_Y + $F0,X
E3D9  LDA ram_0001
E3DB  STA ram_spr_T + $F0,X
E3DE  LDA #$20
E3E0  STA ram_spr_A + $F0,X
E3E3  LDA ram_0000
E3E5  STA ram_spr_X + $F0,X
E3E8  CLC
E3E9  ADC #$08
E3EB  STA ram_0000
E3ED  DEX
E3EE  DEX
E3EF  DEX
E3F0  DEX
E3F1  BPL bra_E3D4_loop
E3F3  RTS
sub_E3F4:
E3F4  LDX #$03
bra_E3F6_loop:
E3F6  TXA
E3F7  STA ram_0088,X
E3F9  LDA ram_00B8,X
E3FB  STA ram_0000,X
E3FD  DEX
E3FE  BPL bra_E3F6_loop
E400  LDA ram_0373
E403  BEQ bra_E409
E405  LDA ram_006F
E407  STA ram_0003
bra_E409:
E409  LDX #$03
E40B  STX ram_000D
bra_E40D_loop:
E40D  LDY #$00
bra_E40F_loop:
E40F  LDX ram_0088,Y
E411  LDA ram_0000,X
E413  LDX ram_0089,Y
E415  CMP ram_0000,X
E417  BCC bra_E421
E419  LDA ram_0088,Y
E41C  STA ram_0089,Y
E41F  STX ram_0088,Y
bra_E421:
E421  INY
E422  CPY ram_000D
E424  BNE bra_E40F_loop
E426  DEC ram_000D
E428  BNE bra_E40D_loop
E42A  RTS
loc_E42B:
E42B  LDA ram_03A3
E42E  BEQ bra_E455_RTS
E430  LDX #$03
bra_E432_loop:
E432  LDA ram_0088,X
E434  BEQ bra_E44A
E436  CMP #$03
E438  BNE bra_E43F
E43A  LDA ram_0373
E43D  BNE bra_E44A
bra_E43F:
E43F  LDA tbl_D8C0,X
E442  STA ram_0007
E444  LDY ram_03B3
E447  JSR sub_E4AD
bra_E44A:
E44A  DEX
E44B  BPL bra_E432_loop
E44D  LDA ram_03B3
E450  EOR #$02
E452  STA ram_03B3
bra_E455_RTS:
E455  RTS
sub_E456:
E456  LDY #$03
bra_E458_loop:
E458  STY ram_0005
E45A  LDA tbl_D8C0,Y
E45D  STA ram_0007
E45F  LDA ram_0088,Y
E462  BEQ bra_E495
E464  TAX
E465  LDA ram_0084,X
E467  STA ram_0002
E469  STA ram_0003
E46B  STA ram_0004
E46D  LSR
E46E  BCS bra_E484
E470  LDA ram_0080,X
E472  CMP #$70
E474  BCC bra_E484
E476  CMP #$90
E478  BCS bra_E484
E47A  JSR sub_DB95
E47D  LDA #$01
E47F  STA ram_03A6
E482  BNE bra_E492
bra_E484:
E484  LDA ram_0080,X
E486  CMP #$F8
E488  BCC bra_E48C
E48A  INC ram_0003
bra_E48C:
E48C  CMP #$F0
E48E  BCC bra_E492
E490  INC ram_0004
bra_E492:
E492  JSR sub_E49B
bra_E495:
E495  LDY ram_0005
E497  DEY
E498  BPL bra_E458_loop
E49A  RTS
sub_E49B:
E49B  LDX #$00
bra_E49D_loop:
E49D  LDA ram_0002,X
E49F  LSR
E4A0  BCS bra_E4A7
E4A2  TXA
E4A3  TAY
E4A4  JSR sub_E4AD
bra_E4A7:
E4A7  INX
E4A8  CPX #$03
E4AA  BCC bra_E49D_loop
E4AC  RTS
sub_E4AD:
E4AD  LDA #$02
E4AF  STA ram_0001
E4B1  LDA ram_0007
E4B3  CLC
E4B4  ADC tbl_D8DC,Y
E4B7  STA ram_0000
E4B9  LDY #$00
E4BB  LDA #$F8
bra_E4BD_loop:
E4BD  STA (ram_0000),Y
E4BF  INY
E4C0  INY
E4C1  INY
E4C2  INY
E4C3  CPY #$0C
E4C5  BCC bra_E4BD_loop
E4C7  RTS
sub_E4C8:
E4C8  LDX #$01
bra_E4CA_loop:
E4CA  STX ram_000C
E4CC  LDA ram_0084,X
E4CE  LSR
E4CF  BCS bra_E4D9
E4D1  BNE bra_E50A
E4D3  LDA ram_0080,X
E4D5  CMP #$F8
E4D7  BCC bra_E50A
bra_E4D9:
E4D9  LDA #$00
E4DB  STA ram_000A
E4DD  TXA
E4DE  TAY
E4DF  INY
bra_E4E0_loop:
E4E0  STY ram_0005
E4E2  LDA ram_0084,Y
E4E5  LSR
E4E6  BCS bra_E4F0
E4E8  BNE bra_E4FF
E4EA  LDA ram_0080,X
E4EC  CMP #$F8
E4EE  BCC bra_E4FF
bra_E4F0:
E4F0  JSR sub_E52C
E4F3  BEQ bra_E4FF
E4F5  INC ram_000A
E4F7  LDA ram_000B
E4F9  ASL
E4FA  ASL
E4FB  ORA ram_0005
E4FD  STA ram_000B
bra_E4FF:
E4FF  INY
E500  CPY #$04
E502  BCC bra_E4E0_loop
E504  LDA ram_000A
E506  CMP #$02
E508  BCS bra_E513
bra_E50A:
E50A  LDX ram_000C
E50C  DEX
E50D  BPL bra_E4CA_loop
E50F  LDA #$00
E511  BEQ bra_E528    ; jmp
bra_E513:
E513  BNE bra_E526
E515  LDA ram_000B
E517  PHA
E518  AND #$03
E51A  TAY
E51B  PLA
E51C  LSR
E51D  LSR
E51E  AND #$03
E520  TAX
E521  JSR sub_E52C
E524  BEQ bra_E50A
bra_E526:
E526  LDA #$01
bra_E528:
E528  STA ram_03A3
E52B  RTS
sub_E52C:
E52C  LDA ram_008C,X
E52E  SEC
E52F  SBC ram_008C,Y
E532  CMP #$EC
E534  BCS bra_E53C_RTS
E536  CMP #$12
E538  BCC bra_E53C_RTS
E53A  LDA #$00
bra_E53C_RTS:
E53C  RTS
tbl_E53D:
E53D  .byte $0E   ; 
E53E  .byte $1A   ; 
E53F  .byte $26   ; 
tbl_E540_spr_T:
E540  .byte $32   ; 
E541  .byte $DD   ; 
E542  .byte $DC   ; 
tbl_E543_spr_X:
E543  .byte $DB   ; 
E544  .byte $7C   ; 
E545  .byte $74   ; 
E546  .byte $6C   ; 
tbl_E547_spr_X:
E547  .byte $90   ; 
E548  .byte $88   ; 
E549  .byte $80   ; 
E54A  .byte $78   ; 
E54B  .byte $70   ; 
E54C  .byte $68   ; 
E54D  .byte $60   ; 
tbl_E54E_lo:
E54E  .byte < ram_0400   ; 
E54F  .byte < ram_0440   ; 
E550  .byte < ram_0480   ; 
E551  .byte < ram_04C0   ; 
E552  .byte < ram_0500   ; 
E553  .byte < ram_0540   ; 
tbl_E554_hi:
E554  .byte > ram_0400   ; 
E555  .byte > ram_0440   ; 
E556  .byte > ram_0480   ; 
E557  .byte > ram_04C0   ; 
E558  .byte > ram_0500   ; 
E559  .byte > ram_0540   ; 
tbl_E55A_lo:
E55A  .byte < _off_002_E584_00   ; 
E55B  .byte < _off_002_E599_01   ; 
E55C  .byte < _off_002_E599_02   ; 
E55D  .byte < _off_002_E5A6_03   ; 
E55E  .byte < _off_002_E5BB_04   ; 
E55F  .byte < _off_002_E5D0_05   ; 
E560  .byte < _off_002_E5E5_06   ; 
E561  .byte < _off_002_E5F8_07   ; 
E562  .byte < _off_002_E60B_08   ; 
E563  .byte < _off_002_E61E_09   ; 
E564  .byte < _off_002_E631_0A   ; 
E565  .byte < _off_002_E63E_0B   ; 
E566  .byte < _off_002_E649_0C   ; 
E567  .byte < _off_002_E652_0D   ; 
E568  .byte < _off_002_E667_0E   ; 
E569  .byte < _off_002_E684_0F   ; 
E56A  .byte < _off_002_E686_10   ; 
E56B  .byte < _off_002_E689_11   ; 
E56C  .byte < _off_002_E689_12   ; 
E56D  .byte < _off_002_E68C_13   ; 
E56E  .byte < _off_002_E697_14   ; 
tbl_E56F_hi:
E56F  .byte > _off_002_E584_00   ; 
E570  .byte > _off_002_E599_01   ; 
E571  .byte > _off_002_E599_02   ; 
E572  .byte > _off_002_E5A6_03   ; 
E573  .byte > _off_002_E5BB_04   ; 
E574  .byte > _off_002_E5D0_05   ; 
E575  .byte > _off_002_E5E5_06   ; 
E576  .byte > _off_002_E5F8_07   ; 
E577  .byte > _off_002_E60B_08   ; 
E578  .byte > _off_002_E61E_09   ; 
E579  .byte > _off_002_E631_0A   ; 
E57A  .byte > _off_002_E63E_0B   ; 
E57B  .byte > _off_002_E649_0C   ; 
E57C  .byte > _off_002_E652_0D   ; 
E57D  .byte > _off_002_E667_0E   ; 
E57E  .byte > _off_002_E684_0F   ; 
E57F  .byte > _off_002_E686_10   ; 
E580  .byte > _off_002_E689_11   ; 
E581  .byte > _off_002_E689_12   ; 
E582  .byte > _off_002_E68C_13   ; 
E583  .byte > _off_002_E697_14   ; 
_off_002_E584_00:
E584  .byte $04   ; 
E585  .byte $87   ; 
E586  .byte $08   ; 
E587  .byte $88   ; 
E588  .byte $08   ; 
E589  .byte $44   ; 
E58A  .byte $29   ; 
E58B  .byte $06   ; 
E58C  .byte $29   ; 
E58D  .byte $00   ; 
E58E  .byte $31   ; 
E58F  .byte $85   ; 
E590  .byte $35   ; 
E591  .byte $84   ; 
E592  .byte $35   ; 
E593  .byte $45   ; 
E594  .byte $51   ; 
E595  .byte $00   ; 
E596  .byte $52   ; 
E597  .byte $86   ; 
E598  .byte $FF   ; 
_off_002_E599_01:
_off_002_E599_02:
E599  .byte $04   ; 
E59A  .byte $07   ; 
E59B  .byte $04   ; 
E59C  .byte $88   ; 
E59D  .byte $0C   ; 
E59E  .byte $86   ; 
E59F  .byte $10   ; 
E5A0  .byte $83   ; 
E5A1  .byte $14   ; 
E5A2  .byte $85   ; 
E5A3  .byte $16   ; 
E5A4  .byte $86   ; 
E5A5  .byte $FF   ; 
_off_002_E5A6_03:
E5A6  .byte $04   ; 
E5A7  .byte $88   ; 
E5A8  .byte $0A   ; 
E5A9  .byte $89   ; 
E5AA  .byte $0A   ; 
E5AB  .byte $42   ; 
E5AC  .byte $20   ; 
E5AD  .byte $06   ; 
E5AE  .byte $22   ; 
E5AF  .byte $00   ; 
E5B0  .byte $30   ; 
E5B1  .byte $08   ; 
E5B2  .byte $50   ; 
E5B3  .byte $84   ; 
E5B4  .byte $52   ; 
E5B5  .byte $83   ; 
E5B6  .byte $54   ; 
E5B7  .byte $43   ; 
E5B8  .byte $6C   ; 
E5B9  .byte $00   ; 
E5BA  .byte $FF   ; 
_off_002_E5BB_04:
E5BB  .byte $04   ; 
E5BC  .byte $88   ; 
E5BD  .byte $0A   ; 
E5BE  .byte $89   ; 
E5BF  .byte $0A   ; 
E5C0  .byte $42   ; 
E5C1  .byte $23   ; 
E5C2  .byte $06   ; 
E5C3  .byte $2A   ; 
E5C4  .byte $00   ; 
E5C5  .byte $2F   ; 
E5C6  .byte $84   ; 
E5C7  .byte $33   ; 
E5C8  .byte $83   ; 
E5C9  .byte $34   ; 
E5CA  .byte $43   ; 
E5CB  .byte $53   ; 
E5CC  .byte $00   ; 
E5CD  .byte $55   ; 
E5CE  .byte $86   ; 
E5CF  .byte $FF   ; 
_off_002_E5D0_05:
E5D0  .byte $04   ; 
E5D1  .byte $88   ; 
E5D2  .byte $0A   ; 
E5D3  .byte $89   ; 
E5D4  .byte $0A   ; 
E5D5  .byte $42   ; 
E5D6  .byte $17   ; 
E5D7  .byte $06   ; 
E5D8  .byte $1A   ; 
E5D9  .byte $00   ; 
E5DA  .byte $1F   ; 
E5DB  .byte $84   ; 
E5DC  .byte $23   ; 
E5DD  .byte $83   ; 
E5DE  .byte $23   ; 
E5DF  .byte $43   ; 
E5E0  .byte $35   ; 
E5E1  .byte $00   ; 
E5E2  .byte $37   ; 
E5E3  .byte $86   ; 
E5E4  .byte $FF   ; 
_off_002_E5E5_06:
E5E5  .byte $04   ; 
E5E6  .byte $88   ; 
E5E7  .byte $0A   ; 
E5E8  .byte $89   ; 
E5E9  .byte $0A   ; 
E5EA  .byte $42   ; 
E5EB  .byte $12   ; 
E5EC  .byte $06   ; 
E5ED  .byte $12   ; 
E5EE  .byte $00   ; 
E5EF  .byte $1A   ; 
E5F0  .byte $83   ; 
E5F1  .byte $1B   ; 
E5F2  .byte $43   ; 
E5F3  .byte $24   ; 
E5F4  .byte $00   ; 
E5F5  .byte $26   ; 
E5F6  .byte $86   ; 
E5F7  .byte $FF   ; 
_off_002_E5F8_07:
E5F8  .byte $04   ; 
E5F9  .byte $88   ; 
E5FA  .byte $0A   ; 
E5FB  .byte $89   ; 
E5FC  .byte $0A   ; 
E5FD  .byte $42   ; 
E5FE  .byte $22   ; 
E5FF  .byte $06   ; 
E600  .byte $22   ; 
E601  .byte $00   ; 
E602  .byte $2A   ; 
E603  .byte $82   ; 
E604  .byte $2B   ; 
E605  .byte $4A   ; 
E606  .byte $38   ; 
E607  .byte $00   ; 
E608  .byte $3A   ; 
E609  .byte $86   ; 
E60A  .byte $FF   ; 
_off_002_E60B_08:
E60B  .byte $04   ; 
E60C  .byte $88   ; 
E60D  .byte $0A   ; 
E60E  .byte $8B   ; 
E60F  .byte $0B   ; 
E610  .byte $49   ; 
E611  .byte $17   ; 
E612  .byte $06   ; 
E613  .byte $17   ; 
E614  .byte $00   ; 
E615  .byte $25   ; 
E616  .byte $83   ; 
E617  .byte $26   ; 
E618  .byte $43   ; 
E619  .byte $3B   ; 
E61A  .byte $00   ; 
E61B  .byte $3D   ; 
E61C  .byte $86   ; 
E61D  .byte $FF   ; 
_off_002_E61E_09:
E61E  .byte $04   ; 
E61F  .byte $8B   ; 
E620  .byte $08   ; 
E621  .byte $49   ; 
E622  .byte $18   ; 
E623  .byte $06   ; 
E624  .byte $18   ; 
E625  .byte $00   ; 
E626  .byte $1F   ; 
E627  .byte $84   ; 
E628  .byte $20   ; 
E629  .byte $82   ; 
E62A  .byte $25   ; 
E62B  .byte $4A   ; 
E62C  .byte $35   ; 
E62D  .byte $00   ; 
E62E  .byte $37   ; 
E62F  .byte $86   ; 
E630  .byte $FF   ; 
_off_002_E631_0A:
E631  .byte $02   ; 
E632  .byte $01   ; 
E633  .byte $04   ; 
E634  .byte $88   ; 
E635  .byte $0A   ; 
E636  .byte $89   ; 
E637  .byte $0A   ; 
E638  .byte $42   ; 
E639  .byte $1A   ; 
E63A  .byte $06   ; 
E63B  .byte $1A   ; 
E63C  .byte $00   ; 
E63D  .byte $FF   ; 
_off_002_E63E_0B:
E63E  .byte $04   ; 
E63F  .byte $8B   ; 
E640  .byte $08   ; 
E641  .byte $49   ; 
E642  .byte $18   ; 
E643  .byte $06   ; 
E644  .byte $1A   ; 
E645  .byte $00   ; 
E646  .byte $1F   ; 
E647  .byte $0B   ; 
E648  .byte $FF   ; 
_off_002_E649_0C:
E649  .byte $0D   ; 
E64A  .byte $0C   ; 
E64B  .byte $17   ; 
E64C  .byte $0C   ; 
E64D  .byte $28   ; 
E64E  .byte $0C   ; 
E64F  .byte $2B   ; 
E650  .byte $0C   ; 
E651  .byte $FF   ; 
_off_002_E652_0D:
E652  .byte $04   ; 
E653  .byte $8B   ; 
E654  .byte $08   ; 
E655  .byte $49   ; 
E656  .byte $22   ; 
E657  .byte $06   ; 
E658  .byte $22   ; 
E659  .byte $00   ; 
E65A  .byte $22   ; 
E65B  .byte $14   ; 
E65C  .byte $30   ; 
E65D  .byte $0F   ; 
E65E  .byte $31   ; 
E65F  .byte $83   ; 
E660  .byte $32   ; 
E661  .byte $82   ; 
E662  .byte $33   ; 
E663  .byte $4A   ; 
E664  .byte $4B   ; 
E665  .byte $00   ; 
E666  .byte $FF   ; 
_off_002_E667_0E:
E667  .byte $00   ; 
E668  .byte $0B   ; 
E669  .byte $18   ; 
E66A  .byte $06   ; 
E66B  .byte $18   ; 
E66C  .byte $84   ; 
E66D  .byte $1A   ; 
E66E  .byte $83   ; 
E66F  .byte $1A   ; 
E670  .byte $43   ; 
E671  .byte $3B   ; 
E672  .byte $00   ; 
E673  .byte $42   ; 
E674  .byte $10   ; 
E675  .byte $43   ; 
E676  .byte $85   ; 
E677  .byte $48   ; 
E678  .byte $84   ; 
E679  .byte $4A   ; 
E67A  .byte $83   ; 
E67B  .byte $4A   ; 
E67C  .byte $43   ; 
E67D  .byte $5A   ; 
E67E  .byte $00   ; 
E67F  .byte $5A   ; 
E680  .byte $0E   ; 
E681  .byte $5C   ; 
E682  .byte $86   ; 
E683  .byte $FF   ; 
_off_002_E684_0F:
E684  .byte $0E   ; 
E685  .byte $0D   ; 
_off_002_E686_10:
E686  .byte $0F   ; 
E687  .byte $0E   ; 
E688  .byte $FF   ; 
_off_002_E689_11:
_off_002_E689_12:
E689  .byte $00   ; 
E68A  .byte $12   ; 
E68B  .byte $FF   ; 
_off_002_E68C_13:
E68C  .byte $04   ; 
E68D  .byte $88   ; 
E68E  .byte $0A   ; 
E68F  .byte $89   ; 
E690  .byte $0A   ; 
E691  .byte $42   ; 
E692  .byte $1A   ; 
E693  .byte $13   ; 
E694  .byte $1A   ; 
E695  .byte $00   ; 
E696  .byte $FF   ; 
_off_002_E697_14:
E697  .byte $1E   ; 
E698  .byte $86   ; 
E699  .byte $FF   ; 
tbl_E69A:
E69A  .byte $CB   ; 
E69B  .byte $CD   ; 
E69C  .byte $CC   ; 
E69D  .byte $CE   ; 
E69E  .byte $CB   ; 
E69F  .byte $CB   ; 
E6A0  .byte $CB   ; 
tbl_E6A1:
E6A1  .byte $22   ; 
E6A2  .byte $64   ; 
E6A3  .byte $62   ; 
E6A4  .byte $C0   ; 
E6A5  .byte $22   ; 
E6A6  .byte $74   ; 
E6A7  .byte $63   ; 
E6A8  .byte $E0   ; 
E6A9  .byte $21   ; 
E6AA  .byte $83   ; 
E6AB  .byte $FC   ; 
E6AC  .byte $C0   ; 
tbl_E6AD:
E6AD  .byte $03   ; 
E6AE  .byte $01   ; 
E6AF  .byte $02   ; 
E6B0  .byte $02   ; 
E6B1  .byte $00   ; 
E6B2  .byte $05   ; 
E6B3  .byte $05   ; 
E6B4  .byte $06   ; 
E6B5  .byte $04   ; 
E6B6  .byte $04   ; 
tbl_E6B7:
ofs_002_E6B7_11:
E6B7  .word ofs_002_E963_00
E6B9  .word ofs_002_E8E3_01
E6BB  .word ofs_002_E85D_02
E6BD  .word ofs_002_E86A_03
E6BF  .word ofs_002_E845_04
E6C1  .word ofs_002_E854_05
E6C3  .word ofs_002_E934_06
E6C5  .word ofs_002_E818_07
E6C7  .word ofs_002_EA8F_08
E6C9  .word ofs_002_E879_09
E6CB  .word ofs_002_E89D_0A
E6CD  .word ofs_002_E8EE_0B
E6CF  .word ofs_002_E8FF_0C
E6D1  .word ofs_002_E956_0D
E6D3  .word ofs_002_E8BF_0E
E6D5  .word ofs_002_E8C6_0F
E6D7  .word ofs_002_E8FA_10
E6D9  .word ofs_002_E6B7_11   ; unused
E6DB  .word ofs_002_E8D3_12
E6DD  .word ofs_002_E8E7_13
E6DF  .word ofs_002_E8F5_14
tbl_E6E1:
E6E1  .byte $08   ; 
E6E2  .byte $07   ; 
E6E3  .byte $05   ; 
E6E4  .byte $01   ; 
E6E5  .byte $0B   ; 
E6E6  .byte $06   ; 
E6E7  .byte $0A   ; 
E6E8  .byte $0E   ; 
E6E9  .byte $03   ; 
E6EA  .byte $04   ; 
E6EB  .byte $0C   ; 
E6EC  .byte $0D   ; 
E6ED  .byte $0F   ; 
E6EE  .byte $10   ; 
E6EF  .byte $12   ; 
E6F0  .byte $13   ; 
E6F1  .byte $11   ; 
E6F2  .byte $15   ; 
E6F3  .byte $14   ; 
E6F4  .byte $00   ; 
E6F5  .byte $09   ; 
tbl_E6F6_spr_X:
E6F6  .byte $18   ; 
E6F7  .byte $20   ; 
E6F8  .byte $28   ; 
E6F9  .byte $30   ; 
E6FA  .byte $38   ; 
tbl_E6FB:
E6FB  .byte $40   ; 
E6FC  .byte $48   ; 
E6FD  .byte $50   ; 
E6FE  .byte $58   ; 
E6FF  .byte $60   ; 
E700  .byte $68   ; 
E701  .byte $70   ; 
E702  .byte $78   ; 
tbl_E703:
E703  .byte $80   ; 
E704  .byte $88   ; 
E705  .byte $90   ; 
E706  .byte $98   ; 
E707  .byte $A0   ; 
E708  .byte $A8   ; 
E709  .byte $B8   ; 
E70A  .byte $CC   ; 
sub_E70B:
E70B  LDX #$03
bra_E70D_loop:
E70D  LDA ram_0060,X
E70F  BEQ bra_E72B
E711  LDA ram_0064,X
E713  SEC
E714  SBC ram_0060,X
E716  BEQ bra_E71E
E718  BMI bra_E71E
E71A  STA ram_0064,X
E71C  BNE bra_E72B    ; jmp
bra_E71E:
E71E  CLC
E71F  ADC #$08
E721  STA ram_0064,X
E723  INC ram_00E0,X
E725  LDA ram_00E0,X
E727  AND #$3F
E729  STA ram_00E0,X
bra_E72B:
; bzk optimize, start loop at E72D
E72B  LDA #$00
E72D  STA ram_00D8,X
E72F  DEX
E730  BPL bra_E70D_loop
E732  RTS
sub_E733:
E733  LDX #$03
bra_E735_loop:
E735  JSR sub_E73B
E738  DEX
E739  BNE bra_E735_loop
sub_E73B:
E73B  LDA ram_0060,X
E73D  CLC
E73E  ADC ram_00C8,X
E740  STA ram_00C8,X
E742  LDA ram_0058,X
E744  BNE bra_E762_loop
E746  LDA ram_00C0,X
E748  SEC
E749  SBC #$40
E74B  BMI bra_E753_RTS
E74D  LSR
E74E  LSR
E74F  CMP #$16
E751  BCC bra_E754
bra_E753_RTS:
E753  RTS
bra_E754:
E754  STA ram_0058,X
E756  INC ram_0058,X
E758  LDA #$00
E75A  STA ram_00C4,X
E75C  LDA ram_0064,X
E75E  STA ram_00C8,X
E760  DEC ram_00C8,X
bra_E762_loop:
E762  LDY ram_0058,X
E764  LDA tbl_E55A_lo - $01,Y
E767  STA ram_000A
E769  LDA tbl_E56F_hi - $01,Y
E76C  STA ram_000B
E76E  LDY ram_00C4,X
E770  LDA (ram_000A),Y
E772  CMP #$FF
E774  BEQ bra_E7D0
E776  STA ram_000F
E778  CMP ram_00C8,X
E77A  BEQ bra_E77E
E77C  BCS bra_E753_RTS
bra_E77E:
E77E  INY
E77F  LDA (ram_000A),Y
E781  BIT tbl_E703
E784  BNE bra_E7A3
E786  BIT tbl_E6FB
E789  BNE bra_E7F2
E78B  JSR sub_E794
E78E  INC ram_00C4,X
E790  INC ram_00C4,X
E792  BNE bra_E762_loop   ; jmp
sub_E794:
E794  ASL
E795  TAY
E796  LDA tbl_E6B7,Y
E799  STA ram_0000
E79B  LDA tbl_E6B7 + $01,Y
E79E  STA ram_0001
E7A0  JMP (ram_0000)
bra_E7A3:
E7A3  LDA ram_00B0,X
E7A5  ORA ram_0098,X
E7A7  BNE bra_E7CA
E7A9  LDA (ram_000A),Y
E7AB  AND #$0F
E7AD  STA ram_0000
E7AF  LDA ram_00A4,X
E7B1  CMP #$01
E7B3  BEQ bra_E7CA
E7B5  LDA ram_0000
E7B7  STA ram_00AC,X
E7B9  LDA ram_0058,X
E7BB  CMP #$03
E7BD  BEQ bra_E7CA
E7BF  LDA ram_00AC,X
E7C1  SEC
E7C2  SBC #$02
E7C4  TAY
E7C5  LDA tbl_E6AD,Y
E7C8  STA ram_00D4,X
bra_E7CA:
E7CA  INC ram_00C4,X
E7CC  INC ram_00C4,X
E7CE  BNE bra_E762_loop   ; jmp?
bra_E7D0:
E7D0  LDA #$00
E7D2  STA ram_0058,X
E7D4  STA ram_00D4,X
E7D6  LDA ram_00A0,X
E7D8  BNE bra_E7EC
E7DA  LDA ram_00A4,X
E7DC  CMP #$01
E7DE  BEQ bra_E7EC
E7E0  LDA #$00
E7E2  STA ram_00BC,X
E7E4  LDA ram_00A4,X
E7E6  CMP #$02
E7E8  BNE bra_E7EC
E7EA  INC ram_00A4,X
bra_E7EC:
E7EC  LDA #$00
E7EE  STA ram_036C,X
E7F1  RTS
bra_E7F2:
E7F2  AND #$0F
E7F4  STA ram_00CC,X
E7F6  LDA ram_000F
E7F8  STA ram_00D0,X
E7FA  BPL bra_E7CA    ; jmp?
sub_E7FC:
E7FC  LDY ram_0360,X
sub_E7FF:
E7FF  LDA ram_00E0,X
E801  STA ram_0008
sub_E803:
E803  JSR sub_E80D
E806  STY ram_0007
E808  LDY ram_0008
E80A  LDA (ram_0003),Y
E80C  RTS
sub_E80D:
E80D  LDA tbl_E54E_lo,Y
E810  STA ram_0003
E812  LDA tbl_E554_hi,Y
E815  STA ram_0004
E817  RTS
ofs_002_E818_07:
E818  LDA ram_00B0,X
E81A  BNE bra_E835_RTS
E81C  LDA ram_00AC,X
E81E  CMP #$07
E820  BPL bra_E835_RTS
E822  LDA ram_0094,X
E824  CMP #$03
E826  BCS bra_E831
E828  CMP #$02
E82A  BNE bra_E835_RTS
E82C  LDA ram_0090,X
E82E  ASL
E82F  BCC bra_E835_RTS
bra_E831:
E831  LDA #$FF
E833  STA ram_0098,X
bra_E835_RTS:
E835  RTS
sub_E836:
E836  LDX #$03
bra_E838_loop:
E838  LDA ram_00B0,X
E83A  BNE bra_E841
E83C  JSR sub_DC97
E83F  STA ram_008C,X
bra_E841:
E841  DEX
E842  BPL bra_E838_loop
E844  RTS
ofs_002_E845_04:
E845  LDA #$80
E847  STA ram_00D8,X
E849  LDA #$05
E84B  JSR sub_E893
E84E  LSR
sub_E84F:
loc_E84F:
E84F  STA ram_00BC,X
E851  STA ram_00E4,X
E853  RTS
ofs_002_E854_05:
E854  LDA #$02
E856  JSR sub_E893
E859  LSR
E85A  JMP loc_E86F
ofs_002_E85D_02:
E85D  LDA #$06
E85F  JSR sub_E893
E862  JSR sub_E84F
E865  LDA #$60
E867  STA ram_00D8,X
E869  RTS
ofs_002_E86A_03:
E86A  LDA #$01
E86C  JSR sub_E893
loc_E86F:
sub_E86F:
E86F  STA ram_0000
E871  LDA ram_00E4,X
E873  SEC
E874  SBC ram_0000
E876  STA ram_00BC,X
E878  RTS
ofs_002_E879_09:
E879  LDA #$04
E87B  JSR sub_E893
E87E  ASL
E87F  JSR sub_E84F
E882  LDA ram_00A0,X
E884  BEQ bra_E88E
E886  LDA ram_00BC,X
E888  CLC
E889  ADC #$10
E88B  JSR sub_E84F
bra_E88E:
E88E  LDA #$40
E890  STA ram_00D8,X
E892  RTS
sub_E893:
E893  STA ram_00D4,X
E895  STA ram_00B4,X
E897  LDA ram_00C8,X
E899  SEC
E89A  SBC ram_00D0,X
E89C  RTS
ofs_002_E89D_0A:
E89D  LDA ram_00A4,X
E89F  BEQ bra_E8A5
E8A1  CMP #$01
E8A3  BEQ bra_E8BE_RTS
bra_E8A5:
E8A5  LDA #$03
E8A7  JSR sub_E893
E8AA  ASL
E8AB  JSR sub_E86F
E8AE  LDA ram_00A4,X
E8B0  CMP #$04
E8B2  BNE bra_E8BE_RTS
E8B4  JSR sub_DD06
E8B7  LDA #$02
E8B9  STA ram_00A4,X
E8BB  STA ram_0364,X
bra_E8BE_RTS:
E8BE  RTS
ofs_002_E8BF_0E:
E8BF  LDA #$00
E8C1  STA ram_00A4,X
bra_E8C3:
E8C3  STA ram_00A0,X
E8C5  RTS
ofs_002_E8C6_0F:
E8C6  LDA #$01
E8C8  STA ram_00A4,X
E8CA  LDA ram_00B8,X
E8CC  CMP #$20
E8CE  BCS bra_E8D2_RTS
E8D0  INC ram_00A4,X
bra_E8D2_RTS:
E8D2  RTS
ofs_002_E8D3_12:
E8D3  TXA
E8D4  ORA ram_00B0,X
E8D6  ORA ram_03E0
E8D9  ORA ram_003C
E8DB  BNE bra_E8E2_RTS
E8DD  LDA #$08
E8DF  STA ram_03B6
bra_E8E2_RTS:
E8E2  RTS
ofs_002_E8E3_01:
E8E3  LDA #$01
E8E5  BNE bra_E8C3    ; jmp
ofs_002_E8E7_13:
E8E7  LDA ram_00B0,X
E8E9  BNE bra_E8E2_RTS
E8EB  JMP loc_DCFE
ofs_002_E8EE_0B:
E8EE  LDA #$02
E8F0  STA ram_00A0,X
E8F2  LSR
E8F3  STA ram_00D8,X
ofs_002_E8F5_14:
E8F5  LDA #$30
E8F7  JMP loc_E84F
ofs_002_E8FA_10:
E8FA  LDA #$10
E8FC  JMP loc_E84F
ofs_002_E8FF_0C:
E8FF  LDA ram_00B0,X
E901  BNE bra_E926_RTS
E903  LDA ram_00A4,X
E905  BEQ bra_E90B
E907  LSR
E908  LSR
E909  BCC bra_E926_RTS
bra_E90B:
E90B  STY ram_0001
E90D  LDA ram_0094,X
E90F  BEQ bra_E924
E911  LDY #$04
E913  LDA ram_005C,X
E915  ASL
E916  ASL
E917  BCC bra_E91A
E919  DEY
bra_E91A:
E91A  LDA #$01
E91C  STA ram_036C,X
E91F  INY
E920  INY
E921  JSR sub_CE5C
bra_E924:
E924  LDY ram_0001
bra_E926_RTS:
E926  RTS
sub_E927:
E927  LDX #$03
bra_E929_loop:
E929  LDA ram_00CC,X
E92B  BEQ bra_E930
E92D  JSR sub_E794
bra_E930:
E930  DEX
E931  BPL bra_E929_loop
bra_E933_RTS:
E933  RTS
ofs_002_E934_06:
E934  LDA ram_00B0,X
E936  BNE bra_E933_RTS
E938  LDY #$00
E93A  LDA ram_0094,X
E93C  BEQ bra_E933_RTS
E93E  CMP #$02
E940  BCS bra_E949
E942  LDA ram_0090,X
E944  CMP ram_00D8,X
E946  BCS bra_E949
E948  INY
bra_E949:
E949  TYA
E94A  STA ram_0388,X
E94D  LDA ram_00A0,X
E94F  CMP #$02
E951  BEQ bra_E960
E953  JMP loc_DCFA
ofs_002_E956_0D:
E956  LDA ram_00A4,X
E958  CMP #$01
E95A  BNE bra_E933_RTS
E95C  LDA #$00
E95E  STA ram_00BC,X
bra_E960:
E960  JMP loc_DD06
ofs_002_E963_00:
E963  LDA #$00
E965  STA ram_00CC,X
E967  STA ram_00D4,X
E969  STA ram_00B4,X
E96B  RTS
sub_E96C:
E96C  LDX #$03
loc_E96E_loop:
E96E  LDA ram_0058,X
E970  CMP #$15
E972  BEQ bra_E97F
E974  CMP #$14
E976  BEQ bra_E97F
E978  LDA ram_00B8,X
E97A  CLC
E97B  ADC ram_00DC,X
E97D  STA ram_00B8,X
bra_E97F:
E97F  LDY #$03
bra_E981_loop:
E981  LDA ram_00B8,X
E983  CMP tbl_E53D,Y
E986  BEQ bra_EA01
E988  DEY
E989  BPL bra_E981_loop
E98B  LDA ram_00A4,X
E98D  BEQ bra_E9C4
E98F  CMP #$01
E991  BNE bra_E9B8
E993  LDA ram_00B8,X
E995  CMP #$20
E997  BCS bra_E9C4
E999  LDA #$04
E99B  STA ram_00A4,X
E99D  LDA ram_0058,X
E99F  BEQ bra_E9AD
E9A1  CMP #$12
E9A3  BEQ bra_E9AD
E9A5  CMP #$10
E9A7  BEQ bra_E9AD
E9A9  CMP #$0D
E9AB  BNE bra_E9E3
bra_E9AD:
E9AD  LDA #$00
E9AF  STA ram_00BC,X
E9B1  JSR sub_DD06
E9B4  DEC ram_00A4,X
E9B6  BNE bra_E9E3
bra_E9B8:
E9B8  CMP #$03
E9BA  BEQ bra_E9C4
E9BC  LDA ram_00B8,X
E9BE  CMP #$20
E9C0  BCC bra_E9C4
E9C2  DEC ram_00B8,X
bra_E9C4:
E9C4  LDA ram_00B8,X
E9C6  CMP #$08
E9C8  BCC bra_E9E9
E9CA  CMP #$3A
E9CC  BCC bra_E9E3
E9CE  LDA #$39
E9D0  STA ram_00B8,X
bra_E9D2:
E9D2  LDA ram_009C,X
E9D4  ORA ram_03E0,X
E9D7  BNE bra_E9E3
bra_E9D9:
E9D9  LDA ram_00DC,X
E9DB  BNE bra_E9DF
E9DD  LDA #$FF
bra_E9DF:
E9DF  EOR #$FE
E9E1  STA ram_00DC,X
bra_E9E3:
E9E3  DEX
E9E4  BMI bra_EA07
E9E6  JMP loc_E96E_loop
bra_E9E9:
E9E9  LDA ram_009C,X
E9EB  BNE bra_E9F1
E9ED  LDA #$07
E9EF  BNE bra_E9F9    ; jmp
bra_E9F1:
E9F1  LDA ram_00B8,X
E9F3  CMP #$02
E9F5  BCS bra_E9F9
E9F7  LDA #$01
bra_E9F9:
E9F9  STA ram_00B8,X
E9FB  CPX #$00
E9FD  BEQ bra_E9D9
E9FF  BNE bra_E9D2    ; jmp
bra_EA01:
EA01  LDA #$00
EA03  STA ram_00DC,X
EA05  BEQ bra_E9E3    ; jmp
bra_EA07:
EA07  LDA ram_004F
EA09  BEQ bra_EA43_RTS
EA0B  LDA ram_0098
EA0D  ORA ram_03E0
EA10  ORA ram_03F7
EA13  BNE bra_EA43_RTS
EA15  LDA ram_00B0
EA17  BEQ bra_EA23
EA19  LDA ram_0388
EA1C  CMP #$02
EA1E  BNE bra_EA43_RTS
EA20  INC ram_0388
bra_EA23:
EA23  LDA ram_009C
EA25  BEQ bra_EA2B
EA27  CMP #$05
EA29  BNE bra_EA43_RTS
bra_EA2B:
EA2B  LDA ram_btn_hold
EA2D  AND #con_btns_UD
EA2F  BEQ bra_EA43_RTS
EA31  AND #con_btn_Down
EA33  BNE bra_EA39
EA35  LDA #$01
EA37  BNE bra_EA3B    ; jmp
bra_EA39:
EA39  LDA #$FF
bra_EA3B:
EA3B  STA ram_00DC
EA3D  LDA #$04
EA3F  ORA ram_00FD
EA41  STA ram_00FD
bra_EA43_RTS:
EA43  RTS
sub_EA44:
EA44  LDX #$03
bra_EA46_loop:
EA46  TXA
EA47  ASL
EA48  ASL
EA49  ASL
EA4A  TAY
EA4B  LDA ram_0084,X
EA4D  LSR
EA4E  BCC bra_EA58
EA50  LDA ram_0080,X
EA52  CMP #$F4
EA54  BCC bra_EA61
EA56  BCS bra_EA88
bra_EA58:
EA58  LSR
EA59  BCS bra_EA88
EA5B  LDA ram_0080,X
EA5D  CMP #$F6
EA5F  BCC bra_EA88
bra_EA61:
EA61  LDA ram_00B0,X
EA63  BEQ bra_EA88
EA65  LDA #$B6
EA67  JSR sub_DC9A
EA6A  STA ram_spr_Y + $94,Y
EA6D  LDA ram_0080,X
EA6F  CLC
EA70  ADC #$0A
EA72  STA ram_spr_X + $94,Y
EA75  STY ram_0001
EA77  LDY ram_00B4,X
EA79  LDA tbl_E69A,Y
EA7C  LDY ram_0001
EA7E  STA ram_spr_T + $94,Y
EA81  LDA #$00
EA83  STA ram_spr_A + $94,Y
EA86  BEQ bra_EA8B    ; jmp
bra_EA88:
EA88  JSR sub_E2F6
bra_EA8B:
EA8B  DEX
EA8C  BPL bra_EA46_loop
EA8E  RTS
ofs_002_EA8F_08:
EA8F  CPX #$00
EA91  BNE bra_EAC4_RTS
EA93  LDA #$1D
EA95  STA ram_003A
EA97  LDA ram_0057
EA99  BEQ bra_EAB5
EA9B  LDA ram_003C
EA9D  BNE bra_EAC0
EA9F  STX ram_000D
EAA1  LDX #$06
EAA3  LDY #$19
bra_EAA5_loop:
EAA5  LDA ram_03D9,X
EAA8  STA ram_spr_Y + $C0,Y
EAAB  DEY
EAAC  DEY
EAAD  DEY
EAAE  DEY
EAAF  DEX
EAB0  BPL bra_EAA5_loop
EAB2  LDX ram_000D
EAB4  RTS
bra_EAB5:
EAB5  LDA #$10
EAB7  STA ram_0032
EAB9  LDA #$02
EABB  STA ram_00FD
EABD  LSR
EABE  STA ram_0052
bra_EAC0:
EAC0  LDA #$00
EAC2  STA ram_003A
bra_EAC4_RTS:
EAC4  RTS
sub_EAC5:
EAC5  LDA ram_0052
EAC7  ORA ram_003C
EAC9  BNE bra_EAC0
EACB  LDA ram_003A
EACD  BEQ bra_EAC4_RTS
EACF  LDX #$00
EAD1  LDY #$03
EAD3  LDA ram_003A
EAD5  CMP #$0D
EAD7  BCC bra_EAE0
EAD9  LSR
EADA  BCC bra_EB16_RTS
EADC  LDA #$40
EADE  STA ram_00FB
bra_EAE0:
bra_EAE0_loop:
EAE0  LDA #$42
EAE2  STA ram_spr_Y + $B4,X
EAE5  INX
EAE6  LDA tbl_E540_spr_T,Y
EAE9  STA ram_spr_T + $B4 - $01,X
EAEC  INX
EAED  LDA #$00
EAEF  STA ram_spr_A + $B4 - $02,X
EAF2  INX
EAF3  LDA tbl_E543_spr_X,Y
EAF6  STA ram_spr_X + $B4 - $03,X
EAF9  INX
EAFA  DEY
EAFB  BNE bra_EAE0_loop
EAFD  LDX #$06
bra_EAFF_loop:
EAFF  LDA #$4A
EB01  STA ram_spr_Y + $C0,Y
EB04  INY
EB05  INY
EB06  LDA #$00
EB08  STA ram_spr_A + $C0 - $02,Y
EB0B  INY
EB0C  LDA tbl_E547_spr_X,X
EB0F  STA ram_spr_X + $C0 - $03,Y
EB12  INY
EB13  DEX
EB14  BPL bra_EAFF_loop
bra_EB16_RTS:
EB16  RTS
sub_EB17:
EB17  LDA ram_00BE
EB19  BNE bra_EB7E_RTS
EB1B  LDA ram_00B4
EB1D  BEQ bra_EB23
EB1F  DEC ram_00B4
EB21  BNE bra_EB5E
bra_EB23:
EB23  LDA ram_00BD
EB25  ORA ram_00B9
EB27  BNE bra_EB5E
EB29  STA ram_0060
EB2B  STA ram_00C0
EB2D  LDA ram_00BF
EB2F  BEQ bra_EB35
EB31  CMP #$01
EB33  BNE bra_EB9E
bra_EB35:
EB35  LDA ram_00C1
EB37  CMP #$02
EB39  BEQ bra_EB5E
EB3B  LDA ram_00C1
EB3D  BEQ bra_EB49
EB3F  LDA #$09
EB41  STA ram_00B8
bra_EB43:
EB43  LDA #$02
EB45  STA ram_00C1
EB47  BNE bra_EB93    ; jmp
bra_EB49:
EB49  LDA ram_00BF
EB4B  BNE bra_EB5E
EB4D  LDA ram_005C
EB4F  ASL
EB50  BCC bra_EB7F
EB52  LDA #$00
EB54  STA ram_0049
EB56  LDA ram_002B
EB58  BNE bra_EB9D_RTS
EB5A  LDA #$05
EB5C  STA ram_002B
bra_EB5E:
EB5E  LDA #$04
EB60  STA ram_0060
EB62  JSR sub_EC99
EB65  LDY ram_00B3
EB67  LDA #$00
EB69  STA ram_00BD
EB6B  JSR sub_ECC9
EB6E  BNE bra_EB7C
EB70  INY
EB71  CPY #$40
EB73  BNE bra_EB77
EB75  LDY #$00
bra_EB77:
EB77  JSR sub_ECC9
EB7A  BEQ bra_EB9D_RTS
bra_EB7C:
EB7C  INC ram_00BD
bra_EB7E_RTS:
EB7E  RTS
bra_EB7F:
EB7F  ASL
EB80  BCC bra_EBF6
EB82  LDA ram_0049
EB84  BNE bra_EB9D_RTS
EB86  JSR sub_EC75
EB89  LDA ram_00B8
EB8B  CMP #$FF
EB8D  BEQ bra_EB9D_RTS
EB8F  CMP #$09
EB91  BEQ bra_EB43
bra_EB93:
EB93  LDA #$01
EB95  STA ram_00BE
EB97  STA ram_0049
EB99  LDA #$40
EB9B  STA ram_00FB
bra_EB9D_RTS:
EB9D  RTS
bra_EB9E:
EB9E  LDA ram_0049
EBA0  BNE bra_EBB6
EBA2  LDA ram_005C
EBA4  ASL
EBA5  ASL
EBA6  BCC bra_EBBD
EBA8  JSR sub_C3B1
EBAB  JSR sub_EC3B
EBAE  STX ram_0047
EBB0  STX ram_0042
EBB2  LDA #$08
EBB4  STA ram_0041
bra_EBB6:
EBB6  LDA ram_005C
EBB8  BNE bra_EBBC_RTS
EBBA  STA ram_0049
bra_EBBC_RTS:
EBBC  RTS
bra_EBBD:
EBBD  JSR sub_EC5D
EBC0  LDA ram_003A
EBC2  BNE bra_EBBC_RTS
EBC4  INC ram_003A
EBC6  LDA ram_005C
EBC8  CMP #$80
EBCA  BEQ bra_EBD0
EBCC  CMP #$08
EBCE  BNE bra_EBE9
bra_EBD0:
EBD0  INC ram_05E0
EBD3  LDA ram_05E0
EBD6  CMP #$0A
EBD8  BMI bra_EBDF
EBDA  LDA #$01
bra_EBDC:
EBDC  STA ram_05E0
bra_EBDF:
EBDF  LDA #$01
EBE1  STA ram_00FF
EBE3  LSR
EBE4  STA ram_0049
EBE6  JMP loc_EC47
bra_EBE9:
EBE9  CMP #$04
EBEB  BNE bra_EBB6
EBED  DEC ram_05E0
EBF0  BNE bra_EBDF
EBF2  LDA #$09
EBF4  BNE bra_EBDC    ; jmp
bra_EBF6:
EBF6  LDA ram_002C
EBF8  BNE bra_EC3A_RTS
EBFA  LDA #$08
EBFC  STA ram_002C
EBFE  LDA ram_005C
EC00  LSR
EC01  BCS bra_EC10
EC03  LSR
EC04  BCC bra_EC3A_RTS
EC06  DEC ram_00C2
EC08  LDA ram_00C2
EC0A  BPL bra_EC1C
EC0C  LDA #$14
EC0E  BNE bra_EC1A    ; jmp
bra_EC10:
EC10  INC ram_00C2
EC12  LDA ram_00C2
EC14  CMP #$15
EC16  BCC bra_EC1C
EC18  LDA #$00
bra_EC1A:
EC1A  STA ram_00C2
bra_EC1C:
EC1C  LDA #$01
EC1E  STA ram_00FF
EC20  LSR
EC21  STA ram_0049
EC23  LDA #$D0
sub_EC25:
EC25  STA ram_spr_Y + $30
EC28  LDA #$CA
EC2A  STA ram_spr_T + $30
EC2D  LDA #$00
EC2F  STA ram_spr_A + $30
EC32  LDX ram_00C2
EC34  LDA tbl_E6F6_spr_X,X
EC37  STA ram_spr_X + $30
bra_EC3A_RTS:
EC3A  RTS
sub_EC3B:
EC3B  LDX #$00
bra_EC3D_loop:
EC3D  LDA ram_05E0,X
EC40  STA ram_06E0,X
EC43  DEX
EC44  BNE bra_EC3D_loop
EC46  RTS
loc_EC47:
EC47  LDA #$CF
EC49  STA ram_spr_Y + $34
EC4C  LDA ram_05E0
EC4F  STA ram_spr_T + $34
EC52  LDA #$00
EC54  STA ram_spr_A + $34
EC57  LDA #$E4
EC59  STA ram_spr_X + $34
EC5C  RTS
sub_EC5D:
EC5D  LDA #$F8
EC5F  JSR sub_EC25
EC62  LDA ram_003F
EC64  AND #$10
EC66  BEQ bra_EC6C
EC68  LDA #$F8
EC6A  BNE bra_EC6E    ; jmp
bra_EC6C:
EC6C  LDA #$C7
bra_EC6E:
EC6E  STA ram_spr_Y + $28
EC71  STA ram_spr_Y + $2C
EC74  RTS
sub_EC75:
EC75  LDA #$00
EC77  STA ram_00CA
EC79  STA ram_00C8
EC7B  STA ram_00C9
EC7D  LDA ram_00B2
EC7F  STA ram_00BA
EC81  LDA ram_00B0
EC83  STA ram_00BB
EC85  LDA ram_00B1
EC87  STA ram_00BC
EC89  LDY ram_00C2
EC8B  LDA tbl_E6E1,Y
EC8E  STA ram_00B8
EC90  CMP #$11
EC92  BCC bra_EC98_RTS
EC94  AND #$0F
EC96  STA ram_00C8
bra_EC98_RTS:
EC98  RTS
sub_EC99:
EC99  LDA ram_0060
EC9B  BEQ bra_EC98_RTS
EC9D  CLC
EC9E  ADC ram_00B9
ECA0  STA ram_00B9
ECA2  CMP #$08
ECA4  BNE bra_EC98_RTS
ECA6  LDA #$01
ECA8  STA ram_00C0
ECAA  LSR
ECAB  STA ram_00B9
ECAD  JSR sub_F6FB
ECB0  LDA ram_00B2
ECB2  JSR sub_ECBF
ECB5  STA ram_00B2
ECB7  LDA ram_00B3
ECB9  JSR sub_ECBF
ECBC  STA ram_00B3
ECBE  RTS
sub_ECBF:
ECBF  CLC
ECC0  ADC #$01
ECC2  CMP #$40
ECC4  BNE bra_ECC8_RTS
bra_ECC6:
ECC6  LDA #$00
bra_ECC8_RTS:
ECC8  RTS
sub_ECC9:
ECC9  LDA #$3D
ECCB  CMP ram_0540,Y
ECCE  BNE bra_ECE1
ECD0  CMP ram_0480,Y
ECD3  BNE bra_ECE1
ECD5  LDA #$3B
ECD7  CMP ram_0400,Y
ECDA  BNE bra_ECE1
ECDC  CMP ram_04C0,Y
ECDF  BEQ bra_ECC6
bra_ECE1:
ECE1  LDA #$01
ECE3  RTS
sub_ECE4:
loc_ECE4:
ECE4  LDY #$03
bra_ECE6_loop:
ECE6  LDA tbl_E6A1,X
ECE9  INX
ECEA  STA ram_0002,Y
ECED  DEY
ECEE  BPL bra_ECE6_loop
ECF0  LDA ram_0005
ECF2  STA ram_0400
ECF5  LDA ram_0002
ECF7  STA ram_0401
ECFA  LDX #$20
ECFC  STX ram_0402
bra_ECFF_loop:
ECFF  LDA ram_0003
ED01  STA ram_0403,X
ED04  DEX
ED05  LDA ram_0004
ED07  STA ram_0403,X
ED0A  DEX
ED0B  BPL bra_ECFF_loop
ED0D  LDA ram_0005
ED0F  EOR #$04
ED11  STA ram_0423
ED14  LDA ram_0002
ED16  STA ram_0424
ED19  LDX #$20
ED1B  STX ram_0425
bra_ED1E_loop:
ED1E  LDA ram_0003
ED20  STA ram_0426,X
ED23  DEX
ED24  LDA ram_0004
ED26  STA ram_0426,X
ED29  DEX
ED2A  BPL bra_ED1E_loop
ED2C  LDA #$00
ED2E  STA ram_0446
ED31  LDA #< ram_0400
ED33  STA ram_0000
ED35  LDA #> ram_0400
ED37  JMP loc_C289
tbl_ED3A_lo:
ED3A  .byte < _off_003_ED46_00   ; 
ED3B  .byte < _off_003_EE59_01   ; 
ED3C  .byte < _off_003_EDC8_02   ; 
ED3D  .byte < _off_003_EED2_03   ; 
ED3E  .byte < _off_003_EFA7_04   ; 
ED3F  .byte < ram_06E0   ; 
tbl_ED40_hi:
ED40  .byte > _off_003_ED46_00   ; 
ED41  .byte > _off_003_EE59_01   ; 
ED42  .byte > _off_003_EDC8_02   ; 
ED43  .byte > _off_003_EED2_03   ; 
ED44  .byte > _off_003_EFA7_04   ; 
ED45  .byte > ram_06E0   ; 
_off_003_ED46_00:
ED46  .byte $02   ; 
ED47  .byte $40   ; 
ED48  .byte $10   ; 
ED49  .byte $30   ; 
ED4A  .byte $40   ; 
ED4B  .byte $36   ; 
ED4C  .byte $0D   ; 
ED4D  .byte $31   ; 
ED4E  .byte $40   ; 
ED4F  .byte $07   ; 
ED50  .byte $05   ; 
ED51  .byte $40   ; 
ED52  .byte $02   ; 
ED53  .byte $88   ; 
ED54  .byte $40   ; 
ED55  .byte $02   ; 
ED56  .byte $88   ; 
ED57  .byte $40   ; 
ED58  .byte $1C   ; 
ED59  .byte $07   ; 
ED5A  .byte $40   ; 
ED5B  .byte $25   ; 
ED5C  .byte $10   ; 
ED5D  .byte $40   ; 
ED5E  .byte $0A   ; 
ED5F  .byte $07   ; 
ED60  .byte $40   ; 
ED61  .byte $02   ; 
ED62  .byte $07   ; 
ED63  .byte $40   ; 
ED64  .byte $02   ; 
ED65  .byte $8D   ; 
ED66  .byte $40   ; 
ED67  .byte $39   ; 
ED68  .byte $07   ; 
ED69  .byte $40   ; 
ED6A  .byte $02   ; 
ED6B  .byte $07   ; 
ED6C  .byte $40   ; 
ED6D  .byte $02   ; 
ED6E  .byte $07   ; 
ED6F  .byte $40   ; 
ED70  .byte $0E   ; 
ED71  .byte $0F   ; 
ED72  .byte $40   ; 
ED73  .byte $10   ; 
ED74  .byte $0C   ; 
ED75  .byte $40   ; 
ED76  .byte $10   ; 
ED77  .byte $06   ; 
ED78  .byte $40   ; 
ED79  .byte $05   ; 
ED7A  .byte $0A   ; 
ED7B  .byte $40   ; 
ED7C  .byte $2B   ; 
ED7D  .byte $0E   ; 
ED7E  .byte $40   ; 
ED7F  .byte $1E   ; 
ED80  .byte $0F   ; 
ED81  .byte $40   ; 
ED82  .byte $02   ; 
ED83  .byte $0E   ; 
ED84  .byte $40   ; 
ED85  .byte $26   ; 
ED86  .byte $0E   ; 
ED87  .byte $40   ; 
ED88  .byte $02   ; 
ED89  .byte $08   ; 
ED8A  .byte $40   ; 
ED8B  .byte $02   ; 
ED8C  .byte $08   ; 
ED8D  .byte $40   ; 
ED8E  .byte $02   ; 
ED8F  .byte $08   ; 
ED90  .byte $40   ; 
ED91  .byte $02   ; 
ED92  .byte $08   ; 
ED93  .byte $40   ; 
ED94  .byte $02   ; 
ED95  .byte $88   ; 
ED96  .byte $40   ; 
ED97  .byte $12   ; 
ED98  .byte $06   ; 
ED99  .byte $40   ; 
ED9A  .byte $02   ; 
ED9B  .byte $11   ; 
ED9C  .byte $46   ; 
ED9D  .byte $0A   ; 
ED9E  .byte $17   ; 
ED9F  .byte $40   ; 
EDA0  .byte $14   ; 
EDA1  .byte $01   ; 
EDA2  .byte $40   ; 
EDA3  .byte $02   ; 
EDA4  .byte $01   ; 
EDA5  .byte $40   ; 
EDA6  .byte $02   ; 
EDA7  .byte $81   ; 
EDA8  .byte $40   ; 
EDA9  .byte $02   ; 
EDAA  .byte $81   ; 
EDAB  .byte $40   ; 
EDAC  .byte $02   ; 
EDAD  .byte $01   ; 
EDAE  .byte $40   ; 
EDAF  .byte $02   ; 
EDB0  .byte $01   ; 
EDB1  .byte $40   ; 
EDB2  .byte $11   ; 
EDB3  .byte $30   ; 
EDB4  .byte $8D   ; 
EDB5  .byte $40   ; 
EDB6  .byte $0A   ; 
EDB7  .byte $0C   ; 
EDB8  .byte $40   ; 
EDB9  .byte $0B   ; 
EDBA  .byte $0D   ; 
EDBB  .byte $40   ; 
EDBC  .byte $03   ; 
EDBD  .byte $8D   ; 
EDBE  .byte $40   ; 
EDBF  .byte $09   ; 
EDC0  .byte $8C   ; 
EDC1  .byte $40   ; 
EDC2  .byte $02   ; 
EDC3  .byte $0C   ; 
EDC4  .byte $40   ; 
EDC5  .byte $0E   ; 
EDC6  .byte $31   ; 
EDC7  .byte $09   ; 
_off_003_EDC8_02:
EDC8  .byte $02   ; 
EDC9  .byte $40   ; 
EDCA  .byte $0F   ; 
EDCB  .byte $30   ; 
EDCC  .byte $40   ; 
EDCD  .byte $34   ; 
EDCE  .byte $03   ; 
EDCF  .byte $40   ; 
EDD0  .byte $07   ; 
EDD1  .byte $04   ; 
EDD2  .byte $40   ; 
EDD3  .byte $0C   ; 
EDD4  .byte $03   ; 
EDD5  .byte $40   ; 
EDD6  .byte $0A   ; 
EDD7  .byte $04   ; 
EDD8  .byte $40   ; 
EDD9  .byte $0E   ; 
EDDA  .byte $03   ; 
EDDB  .byte $40   ; 
EDDC  .byte $06   ; 
EDDD  .byte $83   ; 
EDDE  .byte $40   ; 
EDDF  .byte $09   ; 
EDE0  .byte $04   ; 
EDE1  .byte $40   ; 
EDE2  .byte $06   ; 
EDE3  .byte $84   ; 
EDE4  .byte $40   ; 
EDE5  .byte $0A   ; 
EDE6  .byte $31   ; 
EDE7  .byte $07   ; 
EDE8  .byte $40   ; 
EDE9  .byte $04   ; 
EDEA  .byte $07   ; 
EDEB  .byte $40   ; 
EDEC  .byte $05   ; 
EDED  .byte $8B   ; 
EDEE  .byte $40   ; 
EDEF  .byte $0E   ; 
EDF0  .byte $06   ; 
EDF1  .byte $40   ; 
EDF2  .byte $09   ; 
EDF3  .byte $0A   ; 
EDF4  .byte $40   ; 
EDF5  .byte $07   ; 
EDF6  .byte $0F   ; 
EDF7  .byte $40   ; 
EDF8  .byte $02   ; 
EDF9  .byte $10   ; 
EDFA  .byte $40   ; 
EDFB  .byte $07   ; 
EDFC  .byte $06   ; 
EDFD  .byte $40   ; 
EDFE  .byte $02   ; 
EDFF  .byte $0B   ; 
EE00  .byte $40   ; 
EE01  .byte $02   ; 
EE02  .byte $0A   ; 
EE03  .byte $40   ; 
EE04  .byte $0B   ; 
EE05  .byte $84   ; 
EE06  .byte $40   ; 
EE07  .byte $0B   ; 
EE08  .byte $13   ; 
EE09  .byte $43   ; 
EE0A  .byte $37   ; 
EE0B  .byte $1B   ; 
EE0C  .byte $40   ; 
EE0D  .byte $18   ; 
EE0E  .byte $83   ; 
EE0F  .byte $40   ; 
EE10  .byte $0A   ; 
EE11  .byte $0E   ; 
EE12  .byte $40   ; 
EE13  .byte $09   ; 
EE14  .byte $07   ; 
EE15  .byte $40   ; 
EE16  .byte $02   ; 
EE17  .byte $11   ; 
EE18  .byte $46   ; 
EE19  .byte $16   ; 
EE1A  .byte $17   ; 
EE1B  .byte $40   ; 
EE1C  .byte $0F   ; 
EE1D  .byte $0E   ; 
EE1E  .byte $40   ; 
EE1F  .byte $0B   ; 
EE20  .byte $05   ; 
EE21  .byte $40   ; 
EE22  .byte $05   ; 
EE23  .byte $87   ; 
EE24  .byte $40   ; 
EE25  .byte $09   ; 
EE26  .byte $03   ; 
EE27  .byte $40   ; 
EE28  .byte $0E   ; 
EE29  .byte $05   ; 
EE2A  .byte $40   ; 
EE2B  .byte $06   ; 
EE2C  .byte $0A   ; 
EE2D  .byte $40   ; 
EE2E  .byte $06   ; 
EE2F  .byte $06   ; 
EE30  .byte $40   ; 
EE31  .byte $05   ; 
EE32  .byte $05   ; 
EE33  .byte $40   ; 
EE34  .byte $0F   ; 
EE35  .byte $0F   ; 
EE36  .byte $40   ; 
EE37  .byte $0B   ; 
EE38  .byte $30   ; 
EE39  .byte $13   ; 
EE3A  .byte $43   ; 
EE3B  .byte $37   ; 
EE3C  .byte $1B   ; 
EE3D  .byte $40   ; 
EE3E  .byte $0D   ; 
EE3F  .byte $12   ; 
EE40  .byte $42   ; 
EE41  .byte $2A   ; 
EE42  .byte $19   ; 
EE43  .byte $40   ; 
EE44  .byte $11   ; 
EE45  .byte $04   ; 
EE46  .byte $40   ; 
EE47  .byte $02   ; 
EE48  .byte $8C   ; 
EE49  .byte $40   ; 
EE4A  .byte $06   ; 
EE4B  .byte $0D   ; 
EE4C  .byte $40   ; 
EE4D  .byte $05   ; 
EE4E  .byte $0C   ; 
EE4F  .byte $40   ; 
EE50  .byte $05   ; 
EE51  .byte $03   ; 
EE52  .byte $40   ; 
EE53  .byte $02   ; 
EE54  .byte $8D   ; 
EE55  .byte $40   ; 
EE56  .byte $15   ; 
EE57  .byte $31   ; 
EE58  .byte $09   ; 
_off_003_EE59_01:
EE59  .byte $02   ; 
EE5A  .byte $40   ; 
EE5B  .byte $0F   ; 
EE5C  .byte $30   ; 
EE5D  .byte $40   ; 
EE5E  .byte $33   ; 
EE5F  .byte $31   ; 
EE60  .byte $15   ; 
EE61  .byte $41   ; 
EE62  .byte $06   ; 
EE63  .byte $21   ; 
EE64  .byte $45   ; 
EE65  .byte $06   ; 
EE66  .byte $23   ; 
EE67  .byte $40   ; 
EE68  .byte $0A   ; 
EE69  .byte $07   ; 
EE6A  .byte $40   ; 
EE6B  .byte $06   ; 
EE6C  .byte $87   ; 
EE6D  .byte $40   ; 
EE6E  .byte $08   ; 
EE6F  .byte $0C   ; 
EE70  .byte $40   ; 
EE71  .byte $0B   ; 
EE72  .byte $15   ; 
EE73  .byte $41   ; 
EE74  .byte $06   ; 
EE75  .byte $21   ; 
EE76  .byte $45   ; 
EE77  .byte $06   ; 
EE78  .byte $23   ; 
EE79  .byte $40   ; 
EE7A  .byte $03   ; 
EE7B  .byte $87   ; 
EE7C  .byte $40   ; 
EE7D  .byte $0C   ; 
EE7E  .byte $0F   ; 
EE7F  .byte $40   ; 
EE80  .byte $02   ; 
EE81  .byte $10   ; 
EE82  .byte $40   ; 
EE83  .byte $0F   ; 
EE84  .byte $07   ; 
EE85  .byte $40   ; 
EE86  .byte $0B   ; 
EE87  .byte $07   ; 
EE88  .byte $40   ; 
EE89  .byte $26   ; 
EE8A  .byte $08   ; 
EE8B  .byte $40   ; 
EE8C  .byte $02   ; 
EE8D  .byte $0B   ; 
EE8E  .byte $40   ; 
EE8F  .byte $02   ; 
EE90  .byte $88   ; 
EE91  .byte $40   ; 
EE92  .byte $24   ; 
EE93  .byte $0E   ; 
EE94  .byte $40   ; 
EE95  .byte $02   ; 
EE96  .byte $08   ; 
EE97  .byte $40   ; 
EE98  .byte $02   ; 
EE99  .byte $11   ; 
EE9A  .byte $46   ; 
EE9B  .byte $0A   ; 
EE9C  .byte $17   ; 
EE9D  .byte $40   ; 
EE9E  .byte $02   ; 
EE9F  .byte $0E   ; 
EEA0  .byte $40   ; 
EEA1  .byte $02   ; 
EEA2  .byte $11   ; 
EEA3  .byte $46   ; 
EEA4  .byte $0E   ; 
EEA5  .byte $17   ; 
EEA6  .byte $40   ; 
EEA7  .byte $15   ; 
EEA8  .byte $10   ; 
EEA9  .byte $40   ; 
EEAA  .byte $06   ; 
EEAB  .byte $81   ; 
EEAC  .byte $40   ; 
EEAD  .byte $02   ; 
EEAE  .byte $81   ; 
EEAF  .byte $40   ; 
EEB0  .byte $02   ; 
EEB1  .byte $01   ; 
EEB2  .byte $40   ; 
EEB3  .byte $02   ; 
EEB4  .byte $01   ; 
EEB5  .byte $40   ; 
EEB6  .byte $02   ; 
EEB7  .byte $01   ; 
EEB8  .byte $40   ; 
EEB9  .byte $02   ; 
EEBA  .byte $01   ; 
EEBB  .byte $40   ; 
EEBC  .byte $17   ; 
EEBD  .byte $30   ; 
EEBE  .byte $13   ; 
EEBF  .byte $43   ; 
EEC0  .byte $37   ; 
EEC1  .byte $1B   ; 
EEC2  .byte $40   ; 
EEC3  .byte $1F   ; 
EEC4  .byte $0C   ; 
EEC5  .byte $40   ; 
EEC6  .byte $0E   ; 
EEC7  .byte $0D   ; 
EEC8  .byte $40   ; 
EEC9  .byte $04   ; 
EECA  .byte $8D   ; 
EECB  .byte $40   ; 
EECC  .byte $05   ; 
EECD  .byte $0C   ; 
EECE  .byte $40   ; 
EECF  .byte $1B   ; 
EED0  .byte $31   ; 
EED1  .byte $09   ; 
_off_003_EED2_03:
EED2  .byte $02   ; 
EED3  .byte $40   ; 
EED4  .byte $10   ; 
EED5  .byte $30   ; 
EED6  .byte $40   ; 
EED7  .byte $50   ; 
EED8  .byte $31   ; 
EED9  .byte $14   ; 
EEDA  .byte $44   ; 
EEDB  .byte $03   ; 
EEDC  .byte $1E   ; 
EEDD  .byte $44   ; 
EEDE  .byte $04   ; 
EEDF  .byte $1E   ; 
EEE0  .byte $44   ; 
EEE1  .byte $04   ; 
EEE2  .byte $1F   ; 
EEE3  .byte $1B   ; 
EEE4  .byte $40   ; 
EEE5  .byte $0F   ; 
EEE6  .byte $0D   ; 
EEE7  .byte $40   ; 
EEE8  .byte $05   ; 
EEE9  .byte $83   ; 
EEEA  .byte $40   ; 
EEEB  .byte $03   ; 
EEEC  .byte $0C   ; 
EEED  .byte $40   ; 
EEEE  .byte $09   ; 
EEEF  .byte $14   ; 
EEF0  .byte $44   ; 
EEF1  .byte $03   ; 
EEF2  .byte $1E   ; 
EEF3  .byte $44   ; 
EEF4  .byte $04   ; 
EEF5  .byte $1E   ; 
EEF6  .byte $44   ; 
EEF7  .byte $04   ; 
EEF8  .byte $1F   ; 
EEF9  .byte $1B   ; 
EEFA  .byte $40   ; 
EEFB  .byte $04   ; 
EEFC  .byte $07   ; 
EEFD  .byte $40   ; 
EEFE  .byte $02   ; 
EEFF  .byte $87   ; 
EF00  .byte $40   ; 
EF01  .byte $02   ; 
EF02  .byte $87   ; 
EF03  .byte $40   ; 
EF04  .byte $09   ; 
EF05  .byte $03   ; 
EF06  .byte $40   ; 
EF07  .byte $04   ; 
EF08  .byte $84   ; 
EF09  .byte $40   ; 
EF0A  .byte $05   ; 
EF0B  .byte $04   ; 
EF0C  .byte $40   ; 
EF0D  .byte $07   ; 
EF0E  .byte $83   ; 
EF0F  .byte $40   ; 
EF10  .byte $05   ; 
EF11  .byte $10   ; 
EF12  .byte $40   ; 
EF13  .byte $0C   ; 
EF14  .byte $8A   ; 
EF15  .byte $40   ; 
EF16  .byte $0C   ; 
EF17  .byte $07   ; 
EF18  .byte $40   ; 
EF19  .byte $02   ; 
EF1A  .byte $11   ; 
EF1B  .byte $46   ; 
EF1C  .byte $0A   ; 
EF1D  .byte $17   ; 
EF1E  .byte $40   ; 
EF1F  .byte $19   ; 
EF20  .byte $0E   ; 
EF21  .byte $40   ; 
EF22  .byte $0D   ; 
EF23  .byte $0E   ; 
EF24  .byte $40   ; 
EF25  .byte $04   ; 
EF26  .byte $0B   ; 
EF27  .byte $40   ; 
EF28  .byte $04   ; 
EF29  .byte $08   ; 
EF2A  .byte $40   ; 
EF2B  .byte $02   ; 
EF2C  .byte $08   ; 
EF2D  .byte $40   ; 
EF2E  .byte $02   ; 
EF2F  .byte $88   ; 
EF30  .byte $40   ; 
EF31  .byte $1A   ; 
EF32  .byte $03   ; 
EF33  .byte $40   ; 
EF34  .byte $06   ; 
EF35  .byte $83   ; 
EF36  .byte $40   ; 
EF37  .byte $03   ; 
EF38  .byte $04   ; 
EF39  .byte $40   ; 
EF3A  .byte $08   ; 
EF3B  .byte $0E   ; 
EF3C  .byte $40   ; 
EF3D  .byte $04   ; 
EF3E  .byte $0B   ; 
EF3F  .byte $40   ; 
EF40  .byte $02   ; 
EF41  .byte $0B   ; 
EF42  .byte $40   ; 
EF43  .byte $02   ; 
EF44  .byte $0B   ; 
EF45  .byte $40   ; 
EF46  .byte $02   ; 
EF47  .byte $8B   ; 
EF48  .byte $40   ; 
EF49  .byte $02   ; 
EF4A  .byte $8B   ; 
EF4B  .byte $40   ; 
EF4C  .byte $21   ; 
EF4D  .byte $0F   ; 
EF4E  .byte $40   ; 
EF4F  .byte $0C   ; 
EF50  .byte $0D   ; 
EF51  .byte $40   ; 
EF52  .byte $02   ; 
EF53  .byte $88   ; 
EF54  .byte $40   ; 
EF55  .byte $02   ; 
EF56  .byte $13   ; 
EF57  .byte $43   ; 
EF58  .byte $17   ; 
EF59  .byte $1B   ; 
EF5A  .byte $40   ; 
EF5B  .byte $06   ; 
EF5C  .byte $12   ; 
EF5D  .byte $42   ; 
EF5E  .byte $17   ; 
EF5F  .byte $19   ; 
EF60  .byte $40   ; 
EF61  .byte $03   ; 
EF62  .byte $03   ; 
EF63  .byte $40   ; 
EF64  .byte $08   ; 
EF65  .byte $05   ; 
EF66  .byte $40   ; 
EF67  .byte $02   ; 
EF68  .byte $05   ; 
EF69  .byte $40   ; 
EF6A  .byte $02   ; 
EF6B  .byte $05   ; 
EF6C  .byte $40   ; 
EF6D  .byte $02   ; 
EF6E  .byte $05   ; 
EF6F  .byte $40   ; 
EF70  .byte $02   ; 
EF71  .byte $05   ; 
EF72  .byte $40   ; 
EF73  .byte $02   ; 
EF74  .byte $11   ; 
EF75  .byte $46   ; 
EF76  .byte $0A   ; 
EF77  .byte $30   ; 
EF78  .byte $17   ; 
EF79  .byte $40   ; 
EF7A  .byte $11   ; 
EF7B  .byte $10   ; 
EF7C  .byte $40   ; 
EF7D  .byte $0E   ; 
EF7E  .byte $0C   ; 
EF7F  .byte $40   ; 
EF80  .byte $06   ; 
EF81  .byte $8C   ; 
EF82  .byte $40   ; 
EF83  .byte $09   ; 
EF84  .byte $0D   ; 
EF85  .byte $40   ; 
EF86  .byte $02   ; 
EF87  .byte $8D   ; 
EF88  .byte $40   ; 
EF89  .byte $0C   ; 
EF8A  .byte $0C   ; 
EF8B  .byte $40   ; 
EF8C  .byte $05   ; 
EF8D  .byte $0D   ; 
EF8E  .byte $40   ; 
EF8F  .byte $06   ; 
EF90  .byte $8C   ; 
EF91  .byte $40   ; 
EF92  .byte $02   ; 
EF93  .byte $0C   ; 
EF94  .byte $40   ; 
EF95  .byte $07   ; 
EF96  .byte $8D   ; 
EF97  .byte $40   ; 
EF98  .byte $05   ; 
EF99  .byte $0C   ; 
EF9A  .byte $40   ; 
EF9B  .byte $04   ; 
EF9C  .byte $0D   ; 
EF9D  .byte $40   ; 
EF9E  .byte $07   ; 
EF9F  .byte $8C   ; 
EFA0  .byte $40   ; 
EFA1  .byte $02   ; 
EFA2  .byte $31   ; 
EFA3  .byte $0E   ; 
EFA4  .byte $40   ; 
EFA5  .byte $05   ; 
EFA6  .byte $09   ; 
_off_003_EFA7_04:
EFA7  .byte $02   ; 
EFA8  .byte $40   ; 
EFA9  .byte $10   ; 
EFAA  .byte $30   ; 
EFAB  .byte $40   ; 
EFAC  .byte $32   ; 
EFAD  .byte $0F   ; 
EFAE  .byte $40   ; 
EFAF  .byte $0F   ; 
EFB0  .byte $0C   ; 
EFB1  .byte $40   ; 
EFB2  .byte $08   ; 
EFB3  .byte $31   ; 
EFB4  .byte $0E   ; 
EFB5  .byte $40   ; 
EFB6  .byte $02   ; 
EFB7  .byte $11   ; 
EFB8  .byte $46   ; 
EFB9  .byte $0E   ; 
EFBA  .byte $17   ; 
EFBB  .byte $40   ; 
EFBC  .byte $02   ; 
EFBD  .byte $0A   ; 
EFBE  .byte $40   ; 
EFBF  .byte $06   ; 
EFC0  .byte $15   ; 
EFC1  .byte $41   ; 
EFC2  .byte $06   ; 
EFC3  .byte $21   ; 
EFC4  .byte $45   ; 
EFC5  .byte $06   ; 
EFC6  .byte $23   ; 
EFC7  .byte $40   ; 
EFC8  .byte $02   ; 
EFC9  .byte $08   ; 
EFCA  .byte $40   ; 
EFCB  .byte $03   ; 
EFCC  .byte $08   ; 
EFCD  .byte $40   ; 
EFCE  .byte $03   ; 
EFCF  .byte $08   ; 
EFD0  .byte $40   ; 
EFD1  .byte $03   ; 
EFD2  .byte $88   ; 
EFD3  .byte $40   ; 
EFD4  .byte $03   ; 
EFD5  .byte $88   ; 
EFD6  .byte $40   ; 
EFD7  .byte $09   ; 
EFD8  .byte $83   ; 
EFD9  .byte $40   ; 
EFDA  .byte $05   ; 
EFDB  .byte $04   ; 
EFDC  .byte $40   ; 
EFDD  .byte $08   ; 
EFDE  .byte $10   ; 
EFDF  .byte $40   ; 
EFE0  .byte $11   ; 
EFE1  .byte $0D   ; 
EFE2  .byte $40   ; 
EFE3  .byte $13   ; 
EFE4  .byte $0C   ; 
EFE5  .byte $40   ; 
EFE6  .byte $14   ; 
EFE7  .byte $0E   ; 
EFE8  .byte $40   ; 
EFE9  .byte $13   ; 
EFEA  .byte $05   ; 
EFEB  .byte $40   ; 
EFEC  .byte $04   ; 
EFED  .byte $05   ; 
EFEE  .byte $40   ; 
EFEF  .byte $05   ; 
EFF0  .byte $05   ; 
EFF1  .byte $40   ; 
EFF2  .byte $04   ; 
EFF3  .byte $06   ; 
EFF4  .byte $40   ; 
EFF5  .byte $02   ; 
EFF6  .byte $11   ; 
EFF7  .byte $46   ; 
EFF8  .byte $0A   ; 
EFF9  .byte $17   ; 
EFFA  .byte $40   ; 
EFFB  .byte $05   ; 
EFFC  .byte $0C   ; 
EFFD  .byte $40   ; 
EFFE  .byte $03   ; 
EFFF  .byte $14   ; 
F000  .byte $44   ; 
F001  .byte $03   ; 
F002  .byte $1E   ; 
F003  .byte $44   ; 
F004  .byte $04   ; 
F005  .byte $1E   ; 
F006  .byte $44   ; 
F007  .byte $04   ; 
F008  .byte $1F   ; 
F009  .byte $1B   ; 
F00A  .byte $40   ; 
F00B  .byte $06   ; 
F00C  .byte $07   ; 
F00D  .byte $40   ; 
F00E  .byte $03   ; 
F00F  .byte $83   ; 
F010  .byte $40   ; 
F011  .byte $04   ; 
F012  .byte $0E   ; 
F013  .byte $40   ; 
F014  .byte $17   ; 
F015  .byte $8A   ; 
F016  .byte $40   ; 
F017  .byte $03   ; 
F018  .byte $0E   ; 
F019  .byte $40   ; 
F01A  .byte $02   ; 
F01B  .byte $11   ; 
F01C  .byte $46   ; 
F01D  .byte $05   ; 
F01E  .byte $17   ; 
F01F  .byte $40   ; 
F020  .byte $02   ; 
F021  .byte $0B   ; 
F022  .byte $40   ; 
F023  .byte $06   ; 
F024  .byte $01   ; 
F025  .byte $40   ; 
F026  .byte $02   ; 
F027  .byte $01   ; 
F028  .byte $40   ; 
F029  .byte $02   ; 
F02A  .byte $08   ; 
F02B  .byte $40   ; 
F02C  .byte $02   ; 
F02D  .byte $01   ; 
F02E  .byte $40   ; 
F02F  .byte $02   ; 
F030  .byte $01   ; 
F031  .byte $40   ; 
F032  .byte $02   ; 
F033  .byte $01   ; 
F034  .byte $40   ; 
F035  .byte $02   ; 
F036  .byte $01   ; 
F037  .byte $40   ; 
F038  .byte $02   ; 
F039  .byte $05   ; 
F03A  .byte $40   ; 
F03B  .byte $21   ; 
F03C  .byte $30   ; 
F03D  .byte $0C   ; 
F03E  .byte $40   ; 
F03F  .byte $04   ; 
F040  .byte $83   ; 
F041  .byte $40   ; 
F042  .byte $04   ; 
F043  .byte $0D   ; 
F044  .byte $40   ; 
F045  .byte $04   ; 
F046  .byte $04   ; 
F047  .byte $40   ; 
F048  .byte $08   ; 
F049  .byte $8C   ; 
F04A  .byte $40   ; 
F04B  .byte $02   ; 
F04C  .byte $03   ; 
F04D  .byte $40   ; 
F04E  .byte $05   ; 
F04F  .byte $8D   ; 
F050  .byte $40   ; 
F051  .byte $02   ; 
F052  .byte $0D   ; 
F053  .byte $40   ; 
F054  .byte $06   ; 
F055  .byte $0C   ; 
F056  .byte $40   ; 
F057  .byte $03   ; 
F058  .byte $8C   ; 
F059  .byte $40   ; 
F05A  .byte $05   ; 
F05B  .byte $0D   ; 
F05C  .byte $40   ; 
F05D  .byte $06   ; 
F05E  .byte $04   ; 
F05F  .byte $40   ; 
F060  .byte $05   ; 
F061  .byte $31   ; 
F062  .byte $09   ; 
tbl_F063_lo:
F063  .byte < _off_004_F0AB_00   ; 
F064  .byte < _off_004_F0B3_01   ; 
F065  .byte < _off_004_F101_02   ; 
F066  .byte < _off_004_F101_03   ; 
F067  .byte < _off_004_F10A_04   ; 
F068  .byte < _off_004_F112_05   ; 
F069  .byte < _off_004_F16B_06   ; 
F06A  .byte < _off_004_F1A4_07   ; 
F06B  .byte < _off_004_F1D1_08   ; 
F06C  .byte < _off_004_F1EB_09   ; 
F06D  .byte < _off_004_F25E_0A   ; 
F06E  .byte < _off_004_F297_0B   ; 
F06F  .byte < _off_004_F2E2_0C   ; 
F070  .byte < _off_004_F2CC_0D   ; 
F071  .byte < _off_004_F4B4_0E   ; 
F072  .byte < _off_004_F496_0F   ; 
F073  .byte < _off_004_F4A5_10   ; 
F074  .byte < _off_004_F456_11   ; 
F075  .byte < _off_004_F32D_12   ; 
F076  .byte < _off_004_F335_13   ; 
F077  .byte < _off_004_F35D_14   ; 
F078  .byte < _off_004_F2F8_15   ; 
F079  .byte < _off_004_F45E_16   ; 
F07A  .byte < _off_004_F466_17   ; 
F07B  .byte < _off_004_F34D_18   ; 
F07C  .byte < _off_004_F33D_19   ; 
F07D  .byte < _off_004_F355_1A   ; 
F07E  .byte < _off_004_F345_1B   ; 
F07F  .byte < _off_004_F3C0_1C   ; 
F080  .byte < _off_004_F46E_1D   ; 
F081  .byte < _off_004_F46E_1E   ; 
F082  .byte < _off_004_F3CE_1F   ; 
F083  .byte < _off_004_F30A_20   ; 
F084  .byte < _off_004_F314_21   ; 
F085  .byte < _off_004_F3DC_22   ; 
F086  .byte < _off_004_F3EA_23   ; 
tbl_F087_hi:
F087  .byte > _off_004_F0AB_00   ; 
F088  .byte > _off_004_F0B3_01   ; 
F089  .byte > _off_004_F101_02   ; 
F08A  .byte > _off_004_F101_03   ; 
F08B  .byte > _off_004_F10A_04   ; 
F08C  .byte > _off_004_F112_05   ; 
F08D  .byte > _off_004_F16B_06   ; 
F08E  .byte > _off_004_F1A4_07   ; 
F08F  .byte > _off_004_F1D1_08   ; 
F090  .byte > _off_004_F1EB_09   ; 
F091  .byte > _off_004_F25E_0A   ; 
F092  .byte > _off_004_F297_0B   ; 
F093  .byte > _off_004_F2E2_0C   ; 
F094  .byte > _off_004_F2CC_0D   ; 
F095  .byte > _off_004_F4B4_0E   ; 
F096  .byte > _off_004_F496_0F   ; 
F097  .byte > _off_004_F4A5_10   ; 
F098  .byte > _off_004_F456_11   ; 
F099  .byte > _off_004_F32D_12   ; 
F09A  .byte > _off_004_F335_13   ; 
F09B  .byte > _off_004_F35D_14   ; 
F09C  .byte > _off_004_F2F8_15   ; 
F09D  .byte > _off_004_F45E_16   ; 
F09E  .byte > _off_004_F466_17   ; 
F09F  .byte > _off_004_F34D_18   ; 
F0A0  .byte > _off_004_F33D_19   ; 
F0A1  .byte > _off_004_F355_1A   ; 
F0A2  .byte > _off_004_F345_1B   ; 
F0A3  .byte > _off_004_F3C0_1C   ; 
F0A4  .byte > _off_004_F46E_1D   ; 
F0A5  .byte > _off_004_F46E_1E   ; 
F0A6  .byte > _off_004_F3CE_1F   ; 
F0A7  .byte > _off_004_F30A_20   ; 
F0A8  .byte > _off_004_F314_21   ; 
F0A9  .byte > _off_004_F3DC_22   ; 
F0AA  .byte > _off_004_F3EA_23   ; 
_off_004_F0AB_00:
F0AB  .byte $09   ; 
F0AC  .byte $3B   ; 
F0AD  .byte $3C   ; 
F0AE  .byte $3D   ; 
F0AF  .byte $3B   ; 
F0B0  .byte $3C   ; 
F0B1  .byte $3D   ; 
F0B2  .byte $00   ; 
_off_004_F0B3_01:
F0B3  .byte $08   ; 
F0B4  .byte $D7   ; 
tbl_F0B5:
F0B5  .byte $40   ; 
F0B6  .byte $40   ; 
F0B7  .byte $40   ; 
F0B8  .byte $40   ; 
F0B9  .byte $40   ; 
F0BA  .byte $41   ; 
F0BB  .byte $08   ; 
F0BC  .byte $D6   ; 
F0BD  .byte $FE   ; 
F0BE  .byte $FE   ; 
F0BF  .byte $FE   ; 
F0C0  .byte $FE   ; 
F0C1  .byte $FE   ; 
F0C2  .byte $D8   ; 
F0C3  .byte $07   ; 
F0C4  .byte $D7   ; 
F0C5  .byte $FE   ; 
F0C6  .byte $FE   ; 
F0C7  .byte $FE   ; 
F0C8  .byte $FE   ; 
F0C9  .byte $FE   ; 
F0CA  .byte $D9   ; 
F0CB  .byte $FE   ; 
F0CC  .byte $07   ; 
F0CD  .byte $D6   ; 
F0CE  .byte $FE   ; 
F0CF  .byte $FE   ; 
F0D0  .byte $FE   ; 
F0D1  .byte $FE   ; 
F0D2  .byte $FE   ; 
F0D3  .byte $D8   ; 
F0D4  .byte $FE   ; 
F0D5  .byte $07   ; 
F0D6  .byte $3B   ; 
F0D7  .byte $3C   ; 
F0D8  .byte $3D   ; 
F0D9  .byte $3B   ; 
F0DA  .byte $3C   ; 
F0DB  .byte $3D   ; 
F0DC  .byte $FE   ; 
F0DD  .byte $FE   ; 
F0DE  .byte $07   ; 
F0DF  .byte $DA   ; 
F0E0  .byte $FF   ; 
F0E1  .byte $FF   ; 
F0E2  .byte $FF   ; 
F0E3  .byte $FF   ; 
F0E4  .byte $FF   ; 
F0E5  .byte $DC   ; 
F0E6  .byte $FE   ; 
F0E7  .byte $07   ; 
F0E8  .byte $DB   ; 
F0E9  .byte $FF   ; 
F0EA  .byte $FF   ; 
F0EB  .byte $FF   ; 
F0EC  .byte $FF   ; 
F0ED  .byte $FF   ; 
F0EE  .byte $DD   ; 
F0EF  .byte $FE   ; 
F0F0  .byte $08   ; 
F0F1  .byte $DA   ; 
F0F2  .byte $FF   ; 
F0F3  .byte $FF   ; 
F0F4  .byte $FF   ; 
F0F5  .byte $FF   ; 
F0F6  .byte $FF   ; 
F0F7  .byte $DC   ; 
F0F8  .byte $08   ; 
F0F9  .byte $DB   ; 
F0FA  .byte $FF   ; 
F0FB  .byte $FF   ; 
F0FC  .byte $FF   ; 
F0FD  .byte $FF   ; 
F0FE  .byte $FF   ; 
F0FF  .byte $DD   ; 
F100  .byte $00   ; 
_off_004_F101_02:
_off_004_F101_03:
F101  .byte $08   ; 
F102  .byte $E0   ; 
F103  .byte $48   ; 
F104  .byte $49   ; 
F105  .byte $4A   ; 
F106  .byte $3B   ; 
F107  .byte $3C   ; 
F108  .byte $3D   ; 
F109  .byte $00   ; 
_off_004_F10A_04:
F10A  .byte $09   ; 
F10B  .byte $3B   ; 
F10C  .byte $3C   ; 
F10D  .byte $E1   ; 
F10E  .byte $48   ; 
F10F  .byte $49   ; 
F110  .byte $4A   ; 
F111  .byte $00   ; 
_off_004_F112_05:
F112  .byte $08   ; 
F113  .byte $C5   ; 
F114  .byte $50   ; 
F115  .byte $50   ; 
F116  .byte $50   ; 
F117  .byte $50   ; 
F118  .byte $50   ; 
F119  .byte $51   ; 
F11A  .byte $07   ; 
F11B  .byte $C5   ; 
F11C  .byte $FE   ; 
F11D  .byte $FE   ; 
F11E  .byte $FE   ; 
F11F  .byte $FE   ; 
F120  .byte $FE   ; 
F121  .byte $C6   ; 
F122  .byte $FE   ; 
F123  .byte $06   ; 
F124  .byte $C5   ; 
F125  .byte $FE   ; 
F126  .byte $FE   ; 
F127  .byte $FE   ; 
F128  .byte $FE   ; 
F129  .byte $FE   ; 
F12A  .byte $C6   ; 
F12B  .byte $FE   ; 
F12C  .byte $FE   ; 
F12D  .byte $05   ; 
F12E  .byte $C5   ; 
F12F  .byte $FE   ; 
F130  .byte $FE   ; 
F131  .byte $FE   ; 
F132  .byte $FE   ; 
F133  .byte $FE   ; 
F134  .byte $C6   ; 
F135  .byte $FE   ; 
F136  .byte $FE   ; 
F137  .byte $FE   ; 
F138  .byte $04   ; 
F139  .byte $2F   ; 
F13A  .byte $2E   ; 
F13B  .byte $2B   ; 
F13C  .byte $2D   ; 
F13D  .byte $2C   ; 
F13E  .byte $2B   ; 
F13F  .byte $2A   ; 
F140  .byte $FE   ; 
F141  .byte $FE   ; 
F142  .byte $FE   ; 
F143  .byte $FE   ; 
F144  .byte $05   ; 
F145  .byte $C7   ; 
F146  .byte $C8   ; 
F147  .byte $C9   ; 
F148  .byte $CA   ; 
F149  .byte $C8   ; 
F14A  .byte $C9   ; 
F14B  .byte $CB   ; 
F14C  .byte $FE   ; 
F14D  .byte $FE   ; 
F14E  .byte $FE   ; 
F14F  .byte $06   ; 
F150  .byte $C7   ; 
F151  .byte $C8   ; 
F152  .byte $C9   ; 
F153  .byte $CA   ; 
F154  .byte $C8   ; 
F155  .byte $C9   ; 
F156  .byte $CB   ; 
F157  .byte $FE   ; 
F158  .byte $FE   ; 
F159  .byte $07   ; 
F15A  .byte $C7   ; 
F15B  .byte $C8   ; 
F15C  .byte $C9   ; 
F15D  .byte $CA   ; 
F15E  .byte $C8   ; 
F15F  .byte $C9   ; 
F160  .byte $CB   ; 
F161  .byte $FE   ; 
F162  .byte $08   ; 
F163  .byte $C7   ; 
F164  .byte $C8   ; 
F165  .byte $C9   ; 
F166  .byte $CA   ; 
F167  .byte $C8   ; 
F168  .byte $C9   ; 
F169  .byte $CB   ; 
F16A  .byte $00   ; 
_off_004_F16B_06:
F16B  .byte $08   ; 
F16C  .byte $C5   ; 
F16D  .byte $5E   ; 
F16E  .byte $5E   ; 
F16F  .byte $5E   ; 
F170  .byte $5E   ; 
F171  .byte $5E   ; 
F172  .byte $5F   ; 
F173  .byte $07   ; 
F174  .byte $C5   ; 
F175  .byte $FE   ; 
F176  .byte $FE   ; 
F177  .byte $FE   ; 
F178  .byte $FE   ; 
F179  .byte $FE   ; 
F17A  .byte $C6   ; 
F17B  .byte $FE   ; 
F17C  .byte $06   ; 
F17D  .byte $C5   ; 
F17E  .byte $FE   ; 
F17F  .byte $FE   ; 
F180  .byte $FE   ; 
F181  .byte $FE   ; 
F182  .byte $FE   ; 
F183  .byte $C6   ; 
F184  .byte $FE   ; 
F185  .byte $FE   ; 
F186  .byte $05   ; 
F187  .byte $2F   ; 
F188  .byte $2E   ; 
F189  .byte $2B   ; 
F18A  .byte $2D   ; 
F18B  .byte $2C   ; 
F18C  .byte $2B   ; 
F18D  .byte $2A   ; 
F18E  .byte $FE   ; 
F18F  .byte $FE   ; 
F190  .byte $FE   ; 
F191  .byte $06   ; 
F192  .byte $D1   ; 
F193  .byte $D2   ; 
F194  .byte $FF   ; 
F195  .byte $FF   ; 
F196  .byte $FF   ; 
F197  .byte $FF   ; 
F198  .byte $D3   ; 
F199  .byte $D4   ; 
F19A  .byte $FE   ; 
F19B  .byte $08   ; 
F19C  .byte $D1   ; 
F19D  .byte $D0   ; 
F19E  .byte $D0   ; 
F19F  .byte $D0   ; 
F1A0  .byte $D0   ; 
F1A1  .byte $D0   ; 
F1A2  .byte $D5   ; 
F1A3  .byte $00   ; 
_off_004_F1A4_07:
F1A4  .byte $08   ; 
F1A5  .byte $C5   ; 
F1A6  .byte $56   ; 
F1A7  .byte $56   ; 
F1A8  .byte $56   ; 
F1A9  .byte $56   ; 
F1AA  .byte $56   ; 
F1AB  .byte $57   ; 
F1AC  .byte $07   ; 
F1AD  .byte $C5   ; 
F1AE  .byte $FE   ; 
F1AF  .byte $FE   ; 
F1B0  .byte $FE   ; 
F1B1  .byte $FE   ; 
F1B2  .byte $FE   ; 
F1B3  .byte $C6   ; 
F1B4  .byte $FE   ; 
F1B5  .byte $06   ; 
F1B6  .byte $2F   ; 
F1B7  .byte $2E   ; 
F1B8  .byte $2B   ; 
F1B9  .byte $2D   ; 
F1BA  .byte $2E   ; 
F1BB  .byte $2B   ; 
F1BC  .byte $2A   ; 
F1BD  .byte $FE   ; 
F1BE  .byte $FE   ; 
F1BF  .byte $07   ; 
F1C0  .byte $C7   ; 
F1C1  .byte $C8   ; 
F1C2  .byte $C9   ; 
F1C3  .byte $CA   ; 
F1C4  .byte $C8   ; 
F1C5  .byte $C9   ; 
F1C6  .byte $CB   ; 
F1C7  .byte $FE   ; 
F1C8  .byte $08   ; 
F1C9  .byte $C7   ; 
F1CA  .byte $C8   ; 
F1CB  .byte $C9   ; 
F1CC  .byte $CA   ; 
F1CD  .byte $C8   ; 
F1CE  .byte $C9   ; 
F1CF  .byte $CB   ; 
F1D0  .byte $00   ; 
_off_004_F1D1_08:
F1D1  .byte $08   ; 
F1D2  .byte $C5   ; 
F1D3  .byte $58   ; 
F1D4  .byte $58   ; 
F1D5  .byte $58   ; 
F1D6  .byte $58   ; 
F1D7  .byte $58   ; 
F1D8  .byte $59   ; 
F1D9  .byte $07   ; 
F1DA  .byte $2F   ; 
F1DB  .byte $2E   ; 
F1DC  .byte $2B   ; 
F1DD  .byte $2D   ; 
F1DE  .byte $2C   ; 
F1DF  .byte $2B   ; 
F1E0  .byte $2A   ; 
F1E1  .byte $FE   ; 
F1E2  .byte $08   ; 
F1E3  .byte $C7   ; 
F1E4  .byte $C8   ; 
F1E5  .byte $C9   ; 
F1E6  .byte $CA   ; 
F1E7  .byte $C8   ; 
F1E8  .byte $C9   ; 
F1E9  .byte $CB   ; 
F1EA  .byte $00   ; 
_off_004_F1EB_09:
F1EB  .byte $08   ; 
F1EC  .byte $C5   ; 
F1ED  .byte $4E   ; 
F1EE  .byte $4E   ; 
F1EF  .byte $4E   ; 
F1F0  .byte $4E   ; 
F1F1  .byte $4E   ; 
F1F2  .byte $4F   ; 
F1F3  .byte $07   ; 
F1F4  .byte $C5   ; 
F1F5  .byte $FE   ; 
F1F6  .byte $FE   ; 
F1F7  .byte $FE   ; 
F1F8  .byte $FE   ; 
F1F9  .byte $FE   ; 
F1FA  .byte $C6   ; 
F1FB  .byte $FE   ; 
F1FC  .byte $06   ; 
F1FD  .byte $C5   ; 
F1FE  .byte $FE   ; 
F1FF  .byte $FE   ; 
F200  .byte $FE   ; 
F201  .byte $FE   ; 
F202  .byte $FE   ; 
F203  .byte $C6   ; 
F204  .byte $FE   ; 
F205  .byte $FE   ; 
F206  .byte $06   ; 
F207  .byte $3B   ; 
F208  .byte $3C   ; 
F209  .byte $3D   ; 
F20A  .byte $3B   ; 
F20B  .byte $3C   ; 
F20C  .byte $3D   ; 
F20D  .byte $FE   ; 
F20E  .byte $0F   ; 
F20F  .byte $FE   ; 
F210  .byte $06   ; 
F211  .byte $3B   ; 
F212  .byte $3C   ; 
F213  .byte $3D   ; 
F214  .byte $3B   ; 
F215  .byte $3C   ; 
F216  .byte $3D   ; 
F217  .byte $FE   ; 
F218  .byte $12   ; 
F219  .byte $FE   ; 
F21A  .byte $06   ; 
F21B  .byte $3B   ; 
F21C  .byte $3C   ; 
F21D  .byte $3D   ; 
F21E  .byte $3B   ; 
F21F  .byte $3C   ; 
F220  .byte $3D   ; 
F221  .byte $FE   ; 
F222  .byte $17   ; 
F223  .byte $FE   ; 
F224  .byte $06   ; 
F225  .byte $3B   ; 
F226  .byte $3C   ; 
F227  .byte $3D   ; 
F228  .byte $3B   ; 
F229  .byte $3C   ; 
F22A  .byte $3D   ; 
F22B  .byte $FE   ; 
F22C  .byte $12   ; 
F22D  .byte $FE   ; 
F22E  .byte $06   ; 
F22F  .byte $3B   ; 
F230  .byte $3C   ; 
F231  .byte $3D   ; 
F232  .byte $3B   ; 
F233  .byte $3C   ; 
F234  .byte $3D   ; 
F235  .byte $FE   ; 
F236  .byte $1C   ; 
F237  .byte $FE   ; 
F238  .byte $06   ; 
F239  .byte $3B   ; 
F23A  .byte $3C   ; 
F23B  .byte $3D   ; 
F23C  .byte $3B   ; 
F23D  .byte $3C   ; 
F23E  .byte $3D   ; 
F23F  .byte $FE   ; 
F240  .byte $11   ; 
F241  .byte $FE   ; 
F242  .byte $06   ; 
F243  .byte $C7   ; 
F244  .byte $C8   ; 
F245  .byte $C9   ; 
F246  .byte $CA   ; 
F247  .byte $C8   ; 
F248  .byte $C9   ; 
F249  .byte $CB   ; 
F24A  .byte $FE   ; 
F24B  .byte $FE   ; 
F24C  .byte $07   ; 
F24D  .byte $C7   ; 
F24E  .byte $C8   ; 
F24F  .byte $C9   ; 
F250  .byte $CA   ; 
F251  .byte $C8   ; 
F252  .byte $C9   ; 
F253  .byte $CB   ; 
F254  .byte $FE   ; 
F255  .byte $08   ; 
F256  .byte $C7   ; 
F257  .byte $C8   ; 
F258  .byte $C9   ; 
F259  .byte $CA   ; 
F25A  .byte $C8   ; 
F25B  .byte $C9   ; 
F25C  .byte $CB   ; 
F25D  .byte $00   ; 
_off_004_F25E_0A:
F25E  .byte $08   ; 
F25F  .byte $CC   ; 
F260  .byte $60   ; 
F261  .byte $60   ; 
F262  .byte $60   ; 
F263  .byte $60   ; 
F264  .byte $60   ; 
F265  .byte $61   ; 
F266  .byte $06   ; 
F267  .byte $CC   ; 
F268  .byte $CD   ; 
F269  .byte $FE   ; 
F26A  .byte $FE   ; 
F26B  .byte $FE   ; 
F26C  .byte $FE   ; 
F26D  .byte $CE   ; 
F26E  .byte $CF   ; 
F26F  .byte $FE   ; 
F270  .byte $05   ; 
F271  .byte $2F   ; 
F272  .byte $2E   ; 
F273  .byte $2B   ; 
F274  .byte $2D   ; 
F275  .byte $2C   ; 
F276  .byte $2B   ; 
F277  .byte $2A   ; 
F278  .byte $FE   ; 
F279  .byte $FE   ; 
F27A  .byte $FE   ; 
F27B  .byte $06   ; 
F27C  .byte $C7   ; 
F27D  .byte $C8   ; 
F27E  .byte $C9   ; 
F27F  .byte $CA   ; 
F280  .byte $C8   ; 
F281  .byte $C9   ; 
F282  .byte $CB   ; 
F283  .byte $FE   ; 
F284  .byte $FE   ; 
F285  .byte $07   ; 
F286  .byte $C7   ; 
F287  .byte $C8   ; 
F288  .byte $C9   ; 
F289  .byte $CA   ; 
F28A  .byte $C8   ; 
F28B  .byte $C9   ; 
F28C  .byte $CB   ; 
F28D  .byte $FE   ; 
F28E  .byte $08   ; 
F28F  .byte $C7   ; 
F290  .byte $C8   ; 
F291  .byte $C9   ; 
F292  .byte $CA   ; 
F293  .byte $C8   ; 
F294  .byte $C9   ; 
F295  .byte $CB   ; 
F296  .byte $00   ; 
_off_004_F297_0B:
F297  .byte $07   ; 
F298  .byte $CC   ; 
F299  .byte $CD   ; 
F29A  .byte $65   ; 
F29B  .byte $65   ; 
F29C  .byte $65   ; 
F29D  .byte $65   ; 
F29E  .byte $66   ; 
F29F  .byte $67   ; 
F2A0  .byte $05   ; 
F2A1  .byte $CC   ; 
F2A2  .byte $CD   ; 
F2A3  .byte $FE   ; 
F2A4  .byte $FE   ; 
F2A5  .byte $FE   ; 
F2A6  .byte $FE   ; 
F2A7  .byte $CE   ; 
F2A8  .byte $CF   ; 
F2A9  .byte $FE   ; 
F2AA  .byte $FE   ; 
F2AB  .byte $04   ; 
F2AC  .byte $2F   ; 
F2AD  .byte $2E   ; 
F2AE  .byte $2B   ; 
F2AF  .byte $2D   ; 
F2B0  .byte $2C   ; 
F2B1  .byte $2B   ; 
F2B2  .byte $2A   ; 
F2B3  .byte $FE   ; 
F2B4  .byte $FE   ; 
F2B5  .byte $FE   ; 
F2B6  .byte $FE   ; 
F2B7  .byte $05   ; 
F2B8  .byte $D1   ; 
F2B9  .byte $D2   ; 
F2BA  .byte $FF   ; 
F2BB  .byte $FF   ; 
F2BC  .byte $FF   ; 
F2BD  .byte $FF   ; 
F2BE  .byte $D3   ; 
F2BF  .byte $D4   ; 
F2C0  .byte $FE   ; 
F2C1  .byte $FE   ; 
F2C2  .byte $07   ; 
F2C3  .byte $D1   ; 
F2C4  .byte $D2   ; 
F2C5  .byte $FF   ; 
F2C6  .byte $FF   ; 
F2C7  .byte $FF   ; 
F2C8  .byte $FF   ; 
F2C9  .byte $D3   ; 
F2CA  .byte $D4   ; 
F2CB  .byte $00   ; 
_off_004_F2CC_0D:
F2CC  .byte $09   ; 
F2CD  .byte $3B   ; 
F2CE  .byte $E7   ; 
F2CF  .byte $72   ; 
F2D0  .byte $3B   ; 
F2D1  .byte $E7   ; 
F2D2  .byte $72   ; 
F2D3  .byte $09   ; 
F2D4  .byte $3B   ; 
F2D5  .byte $E8   ; 
F2D6  .byte $BB   ; 
F2D7  .byte $3B   ; 
F2D8  .byte $E8   ; 
F2D9  .byte $BB   ; 
F2DA  .byte $09   ; 
F2DB  .byte $3B   ; 
F2DC  .byte $E9   ; 
F2DD  .byte $BE   ; 
F2DE  .byte $3B   ; 
F2DF  .byte $E9   ; 
F2E0  .byte $BB   ; 
F2E1  .byte $00   ; 
_off_004_F2E2_0C:
F2E2  .byte $09   ; 
F2E3  .byte $70   ; 
F2E4  .byte $EA   ; 
F2E5  .byte $3D   ; 
F2E6  .byte $70   ; 
F2E7  .byte $EA   ; 
F2E8  .byte $3D   ; 
F2E9  .byte $09   ; 
F2EA  .byte $B9   ; 
F2EB  .byte $EB   ; 
F2EC  .byte $3D   ; 
F2ED  .byte $B9   ; 
F2EE  .byte $EB   ; 
F2EF  .byte $3D   ; 
F2F0  .byte $09   ; 
F2F1  .byte $BC   ; 
F2F2  .byte $EC   ; 
F2F3  .byte $3D   ; 
F2F4  .byte $BC   ; 
F2F5  .byte $EC   ; 
F2F6  .byte $3D   ; 
F2F7  .byte $00   ; 
_off_004_F2F8_15:
F2F8  .byte $08   ; 
F2F9  .byte $C5   ; 
F2FA  .byte $68   ; 
F2FB  .byte $68   ; 
F2FC  .byte $68   ; 
F2FD  .byte $68   ; 
F2FE  .byte $68   ; 
F2FF  .byte $69   ; 
F300  .byte $07   ; 
F301  .byte $C5   ; 
F302  .byte $FE   ; 
F303  .byte $FE   ; 
F304  .byte $FE   ; 
F305  .byte $FE   ; 
F306  .byte $FE   ; 
F307  .byte $C6   ; 
F308  .byte $FE   ; 
F309  .byte $00   ; 
_off_004_F30A_20:
F30A  .byte $07   ; 
F30B  .byte $3B   ; 
F30C  .byte $3C   ; 
F30D  .byte $3D   ; 
F30E  .byte $3B   ; 
F30F  .byte $3C   ; 
F310  .byte $3D   ; 
F311  .byte $FE   ; 
F312  .byte $FE   ; 
F313  .byte $00   ; 
_off_004_F314_21:
F314  .byte $05   ; 
F315  .byte $CC   ; 
F316  .byte $CD   ; 
F317  .byte $FE   ; 
F318  .byte $FE   ; 
F319  .byte $6D   ; 
F31A  .byte $6D   ; 
F31B  .byte $6E   ; 
F31C  .byte $6F   ; 
F31D  .byte $6D   ; 
F31E  .byte $6D   ; 
F31F  .byte $03   ; 
F320  .byte $CC   ; 
F321  .byte $CD   ; 
F322  .byte $FE   ; 
F323  .byte $FE   ; 
F324  .byte $FE   ; 
F325  .byte $FE   ; 
F326  .byte $CE   ; 
F327  .byte $CF   ; 
F328  .byte $FE   ; 
F329  .byte $FE   ; 
F32A  .byte $FE   ; 
F32B  .byte $FE   ; 
F32C  .byte $00   ; 
_off_004_F32D_12:
F32D  .byte $09   ; 
F32E  .byte $3B   ; 
F32F  .byte $3C   ; 
F330  .byte $3D   ; 
F331  .byte $C0   ; 
F332  .byte $C0   ; 
F333  .byte $C0   ; 
F334  .byte $00   ; 
_off_004_F335_13:
F335  .byte $09   ; 
F336  .byte $C0   ; 
F337  .byte $C0   ; 
F338  .byte $C0   ; 
F339  .byte $3B   ; 
F33A  .byte $3C   ; 
F33B  .byte $3D   ; 
F33C  .byte $00   ; 
_off_004_F33D_19:
F33D  .byte $09   ; 
F33E  .byte $3B   ; 
F33F  .byte $3C   ; 
F340  .byte $3D   ; 
F341  .byte $C3   ; 
F342  .byte $C3   ; 
F343  .byte $C3   ; 
F344  .byte $00   ; 
_off_004_F345_1B:
F345  .byte $09   ; 
F346  .byte $C3   ; 
F347  .byte $C3   ; 
F348  .byte $C3   ; 
F349  .byte $3B   ; 
F34A  .byte $3C   ; 
F34B  .byte $3D   ; 
F34C  .byte $00   ; 
_off_004_F34D_18:
F34D  .byte $09   ; 
F34E  .byte $3B   ; 
F34F  .byte $3C   ; 
F350  .byte $3D   ; 
F351  .byte $E4   ; 
F352  .byte $E4   ; 
F353  .byte $E4   ; 
F354  .byte $00   ; 
_off_004_F355_1A:
F355  .byte $09   ; 
F356  .byte $E4   ; 
F357  .byte $E4   ; 
F358  .byte $E4   ; 
F359  .byte $3B   ; 
F35A  .byte $3C   ; 
F35B  .byte $3D   ; 
F35C  .byte $00   ; 
_off_004_F35D_14:
F35D  .byte $07   ; 
F35E  .byte $CC   ; 
F35F  .byte $CD   ; 
F360  .byte $75   ; 
F361  .byte $75   ; 
F362  .byte $75   ; 
F363  .byte $75   ; 
F364  .byte $76   ; 
F365  .byte $77   ; 
F366  .byte $05   ; 
F367  .byte $CC   ; 
F368  .byte $CD   ; 
F369  .byte $FE   ; 
F36A  .byte $FE   ; 
F36B  .byte $FE   ; 
F36C  .byte $FE   ; 
F36D  .byte $CE   ; 
F36E  .byte $CF   ; 
F36F  .byte $FE   ; 
F370  .byte $FE   ; 
F371  .byte $03   ; 
F372  .byte $CC   ; 
F373  .byte $CD   ; 
F374  .byte $FE   ; 
F375  .byte $FE   ; 
F376  .byte $FE   ; 
F377  .byte $FE   ; 
F378  .byte $CE   ; 
F379  .byte $CF   ; 
F37A  .byte $FE   ; 
F37B  .byte $FE   ; 
F37C  .byte $FE   ; 
F37D  .byte $FE   ; 
F37E  .byte $03   ; 
F37F  .byte $3B   ; 
F380  .byte $3C   ; 
F381  .byte $3D   ; 
F382  .byte $3B   ; 
F383  .byte $3C   ; 
F384  .byte $3D   ; 
F385  .byte $FE   ; 
F386  .byte $FE   ; 
F387  .byte $FE   ; 
F388  .byte $FE   ; 
F389  .byte $FE   ; 
F38A  .byte $FE   ; 
F38B  .byte $03   ; 
F38C  .byte $3B   ; 
F38D  .byte $3C   ; 
F38E  .byte $3D   ; 
F38F  .byte $3B   ; 
F390  .byte $3C   ; 
F391  .byte $3D   ; 
F392  .byte $FE   ; 
F393  .byte $FE   ; 
F394  .byte $FE   ; 
F395  .byte $FE   ; 
F396  .byte $FE   ; 
F397  .byte $FE   ; 
F398  .byte $03   ; 
F399  .byte $3B   ; 
F39A  .byte $3C   ; 
F39B  .byte $3D   ; 
F39C  .byte $E5   ; 
F39D  .byte $D2   ; 
F39E  .byte $FF   ; 
F39F  .byte $D3   ; 
F3A0  .byte $D4   ; 
F3A1  .byte $FE   ; 
F3A2  .byte $FE   ; 
F3A3  .byte $FE   ; 
F3A4  .byte $FE   ; 
F3A5  .byte $03   ; 
F3A6  .byte $3B   ; 
F3A7  .byte $3C   ; 
F3A8  .byte $3D   ; 
F3A9  .byte $E6   ; 
F3AA  .byte $FC   ; 
F3AB  .byte $D1   ; 
F3AC  .byte $D2   ; 
F3AD  .byte $FF   ; 
F3AE  .byte $D3   ; 
F3AF  .byte $D4   ; 
F3B0  .byte $FE   ; 
F3B1  .byte $FE   ; 
F3B2  .byte $03   ; 
F3B3  .byte $3B   ; 
F3B4  .byte $3C   ; 
F3B5  .byte $3D   ; 
F3B6  .byte $E6   ; 
F3B7  .byte $FC   ; 
F3B8  .byte $FC   ; 
F3B9  .byte $FC   ; 
F3BA  .byte $D1   ; 
F3BB  .byte $D2   ; 
F3BC  .byte $FF   ; 
F3BD  .byte $D3   ; 
F3BE  .byte $D4   ; 
F3BF  .byte $00   ; 
_off_004_F3C0_1C:
F3C0  .byte $03   ; 
F3C1  .byte $3B   ; 
F3C2  .byte $3C   ; 
F3C3  .byte $3D   ; 
F3C4  .byte $E6   ; 
F3C5  .byte $FC   ; 
F3C6  .byte $FC   ; 
F3C7  .byte $FC   ; 
F3C8  .byte $FC   ; 
F3C9  .byte $FC   ; 
F3CA  .byte $3B   ; 
F3CB  .byte $3C   ; 
F3CC  .byte $3D   ; 
F3CD  .byte $00   ; 
_off_004_F3CE_1F:
F3CE  .byte $03   ; 
F3CF  .byte $BF   ; 
F3D0  .byte $7D   ; 
F3D1  .byte $7E   ; 
F3D2  .byte $7F   ; 
F3D3  .byte $FC   ; 
F3D4  .byte $FC   ; 
F3D5  .byte $FC   ; 
F3D6  .byte $FC   ; 
F3D7  .byte $FC   ; 
tbl_F3D8:
F3D8  .byte $80   ; 
F3D9  .byte $81   ; 
F3DA  .byte $82   ; 
F3DB  .byte $00   ; 
_off_004_F3DC_22:
F3DC  .byte $03   ; 
F3DD  .byte $3B   ; 
F3DE  .byte $3C   ; 
F3DF  .byte $3D   ; 
F3E0  .byte $3B   ; 
F3E1  .byte $3C   ; 
F3E2  .byte $3D   ; 
F3E3  .byte $FE   ; 
F3E4  .byte $FE   ; 
F3E5  .byte $FE   ; 
F3E6  .byte $FE   ; 
F3E7  .byte $FE   ; 
F3E8  .byte $FE   ; 
F3E9  .byte $00   ; 
_off_004_F3EA_23:
F3EA  .byte $03   ; 
F3EB  .byte $3B   ; 
F3EC  .byte $3C   ; 
F3ED  .byte $3D   ; 
F3EE  .byte $3B   ; 
F3EF  .byte $3C   ; 
F3F0  .byte $3D   ; 
F3F1  .byte $78   ; 
F3F2  .byte $78   ; 
F3F3  .byte $78   ; 
F3F4  .byte $78   ; 
F3F5  .byte $78   ; 
F3F6  .byte $78   ; 
F3F7  .byte $03   ; 
F3F8  .byte $3B   ; 
F3F9  .byte $3C   ; 
F3FA  .byte $3D   ; 
F3FB  .byte $3B   ; 
F3FC  .byte $3C   ; 
F3FD  .byte $3D   ; 
F3FE  .byte $FE   ; 
F3FF  .byte $FE   ; 
F400  .byte $FE   ; 
F401  .byte $FE   ; 
F402  .byte $FE   ; 
F403  .byte $FE   ; 
F404  .byte $03   ; 
F405  .byte $C7   ; 
F406  .byte $C8   ; 
F407  .byte $C9   ; 
F408  .byte $CA   ; 
F409  .byte $C8   ; 
F40A  .byte $C9   ; 
F40B  .byte $CB   ; 
F40C  .byte $FE   ; 
F40D  .byte $FE   ; 
F40E  .byte $FE   ; 
F40F  .byte $FE   ; 
F410  .byte $FE   ; 
F411  .byte $04   ; 
F412  .byte $C7   ; 
F413  .byte $C8   ; 
F414  .byte $C9   ; 
F415  .byte $CA   ; 
F416  .byte $C8   ; 
F417  .byte $C9   ; 
F418  .byte $CB   ; 
F419  .byte $FE   ; 
F41A  .byte $FE   ; 
F41B  .byte $FE   ; 
F41C  .byte $FE   ; 
F41D  .byte $05   ; 
F41E  .byte $C7   ; 
F41F  .byte $C8   ; 
F420  .byte $C9   ; 
F421  .byte $CA   ; 
F422  .byte $C8   ; 
F423  .byte $C9   ; 
F424  .byte $CB   ; 
F425  .byte $FE   ; 
F426  .byte $FE   ; 
F427  .byte $FE   ; 
F428  .byte $06   ; 
F429  .byte $C7   ; 
F42A  .byte $C8   ; 
F42B  .byte $C9   ; 
F42C  .byte $CA   ; 
F42D  .byte $C8   ; 
F42E  .byte $C9   ; 
F42F  .byte $CB   ; 
F430  .byte $FE   ; 
F431  .byte $FE   ; 
F432  .byte $07   ; 
F433  .byte $3B   ; 
F434  .byte $3C   ; 
F435  .byte $3D   ; 
F436  .byte $3B   ; 
F437  .byte $3C   ; 
F438  .byte $3D   ; 
F439  .byte $FE   ; 
F43A  .byte $FE   ; 
F43B  .byte $07   ; 
F43C  .byte $3B   ; 
F43D  .byte $3C   ; 
F43E  .byte $3D   ; 
F43F  .byte $3B   ; 
F440  .byte $3C   ; 
F441  .byte $3D   ; 
F442  .byte $FE   ; 
F443  .byte $FE   ; 
F444  .byte $07   ; 
F445  .byte $C7   ; 
F446  .byte $C8   ; 
F447  .byte $C9   ; 
F448  .byte $CA   ; 
F449  .byte $C8   ; 
F44A  .byte $C9   ; 
F44B  .byte $CB   ; 
F44C  .byte $FE   ; 
F44D  .byte $08   ; 
F44E  .byte $C7   ; 
F44F  .byte $C8   ; 
F450  .byte $C9   ; 
F451  .byte $CA   ; 
F452  .byte $C8   ; 
F453  .byte $C9   ; 
F454  .byte $CB   ; 
F455  .byte $00   ; 
_off_004_F456_11:
F456  .byte $09   ; 
F457  .byte $C0   ; 
F458  .byte $C0   ; 
F459  .byte $C0   ; 
F45A  .byte $C0   ; 
F45B  .byte $C0   ; 
F45C  .byte $C0   ; 
F45D  .byte $00   ; 
_off_004_F45E_16:
F45E  .byte $09   ; 
F45F  .byte $E4   ; 
F460  .byte $E4   ; 
F461  .byte $E4   ; 
F462  .byte $E4   ; 
F463  .byte $E4   ; 
F464  .byte $E4   ; 
F465  .byte $00   ; 
_off_004_F466_17:
F466  .byte $09   ; 
F467  .byte $C3   ; 
F468  .byte $C3   ; 
F469  .byte $C3   ; 
F46A  .byte $C3   ; 
F46B  .byte $C3   ; 
F46C  .byte $C3   ; 
F46D  .byte $00   ; 
_off_004_F46E_1D:
_off_004_F46E_1E:
F46E  .byte $03   ; 
F46F  .byte $3B   ; 
F470  .byte $3C   ; 
F471  .byte $3D   ; 
F472  .byte $E6   ; 
F473  .byte $28   ; 
F474  .byte $29   ; 
F475  .byte $73   ; 
F476  .byte $73   ; 
F477  .byte $73   ; 
F478  .byte $70   ; 
F479  .byte $71   ; 
F47A  .byte $72   ; 
F47B  .byte $03   ; 
F47C  .byte $3B   ; 
F47D  .byte $3C   ; 
F47E  .byte $3D   ; 
F47F  .byte $E6   ; 
F480  .byte $FC   ; 
F481  .byte $FC   ; 
F482  .byte $FC   ; 
F483  .byte $FC   ; 
F484  .byte $FC   ; 
F485  .byte $B9   ; 
F486  .byte $BA   ; 
F487  .byte $BB   ; 
F488  .byte $03   ; 
F489  .byte $3B   ; 
F48A  .byte $3C   ; 
F48B  .byte $3D   ; 
F48C  .byte $E6   ; 
F48D  .byte $FC   ; 
F48E  .byte $FC   ; 
F48F  .byte $FC   ; 
F490  .byte $FC   ; 
F491  .byte $FC   ; 
F492  .byte $BC   ; 
F493  .byte $BD   ; 
F494  .byte $BE   ; 
F495  .byte $00   ; 
_off_004_F496_0F:
F496  .byte $09   ; 
F497  .byte $88   ; 
F498  .byte $3C   ; 
F499  .byte $3D   ; 
F49A  .byte $3B   ; 
F49B  .byte $3C   ; 
F49C  .byte $3D   ; 
F49D  .byte $09   ; 
F49E  .byte $89   ; 
F49F  .byte $3C   ; 
F4A0  .byte $3D   ; 
F4A1  .byte $3B   ; 
F4A2  .byte $3C   ; 
F4A3  .byte $3D   ; 
F4A4  .byte $00   ; 
_off_004_F4A5_10:
F4A5  .byte $09   ; 
F4A6  .byte $3B   ; 
F4A7  .byte $3C   ; 
F4A8  .byte $3D   ; 
F4A9  .byte $3B   ; 
F4AA  .byte $3C   ; 
F4AB  .byte $88   ; 
F4AC  .byte $09   ; 
F4AD  .byte $3B   ; 
F4AE  .byte $3C   ; 
F4AF  .byte $3D   ; 
F4B0  .byte $3B   ; 
F4B1  .byte $3C   ; 
F4B2  .byte $89   ; 
F4B3  .byte $00   ; 
_off_004_F4B4_0E:
F4B4  .byte $08   ; 
F4B5  .byte $E2   ; 
F4B6  .byte $8D   ; 
F4B7  .byte $8E   ; 
F4B8  .byte $8F   ; 
F4B9  .byte $90   ; 
F4BA  .byte $91   ; 
F4BB  .byte $92   ; 
F4BC  .byte $07   ; 
F4BD  .byte $E2   ; 
F4BE  .byte $DE   ; 
F4BF  .byte $DF   ; 
F4C0  .byte $E3   ; 
F4C1  .byte $FE   ; 
F4C2  .byte $3B   ; 
F4C3  .byte $3C   ; 
F4C4  .byte $3D   ; 
F4C5  .byte $00   ; 
tbl_F4C6:
F4C6  .byte $00   ; 
F4C7  .byte $20   ; 
F4C8  .byte $18   ; 
F4C9  .byte $1A   ; 
F4CA  .byte $1C   ; 
F4CB  .byte $22   ; 
F4CC  .byte $16   ; 
tbl_F4CD:
F4CD  .byte $15   ; 
F4CE  .byte $0A   ; 
F4CF  .byte $19   ; 
F4D0  .byte $FE   ; 
F4D1  .byte $FE   ; 
_off_005_F4D2_01:
; bzk missing flag I indicates that this byte is probably a part of F4CD table
F4D2  .byte $12   ; 
F4D3  .byte $42   ; 
F4D4  .byte $17   ; 
F4D5  .byte $19   ; 
F4D6  .byte $00   ; 
_off_005_F4D7_02:
F4D7  .byte $13   ; 
F4D8  .byte $43   ; 
F4D9  .byte $17   ; 
F4DA  .byte $1B   ; 
F4DB  .byte $00   ; 
_off_005_F4DC_00:
F4DC  .byte $11   ; 
F4DD  .byte $46   ; 
F4DE  .byte $0A   ; 
F4DF  .byte $17   ; 
F4E0  .byte $00   ; 
_off_005_F4E1_03:
F4E1  .byte $14   ; 
F4E2  .byte $44   ; 
F4E3  .byte $03   ; 
F4E4  .byte $1E   ; 
F4E5  .byte $44   ; 
F4E6  .byte $04   ; 
F4E7  .byte $1E   ; 
F4E8  .byte $44   ; 
F4E9  .byte $04   ; 
F4EA  .byte $1F   ; 
F4EB  .byte $1B   ; 
F4EC  .byte $00   ; 
_off_005_F4ED_04:
F4ED  .byte $15   ; 
F4EE  .byte $41   ; 
F4EF  .byte $06   ; 
F4F0  .byte $21   ; 
F4F1  .byte $45   ; 
F4F2  .byte $06   ; 
F4F3  .byte $23   ; 
F4F4  .byte $00   ; 
tbl_F4F5_lo:
F4F5  .byte < _off_005_F4DC_00   ; 
F4F6  .byte < _off_005_F4D2_01   ; 
F4F7  .byte < _off_005_F4D7_02   ; 
F4F8  .byte < _off_005_F4E1_03   ; 
F4F9  .byte < _off_005_F4ED_04   ; 
tbl_F4FA_hi:
F4FA  .byte > _off_005_F4DC_00   ; 
F4FB  .byte > _off_005_F4D2_01   ; 
F4FC  .byte > _off_005_F4D7_02   ; 
F4FD  .byte > _off_005_F4E1_03   ; 
F4FE  .byte > _off_005_F4ED_04   ; 
sub_F4FF:
F4FF  LDX ram_0043
F501  LDA tbl_ED3A_lo,X
F504  STA ram_0007
F506  LDA tbl_ED40_hi,X
F509  STA ram_0008
F50B  LDA ram_00EB
F50D  CMP ram_00E0
F50F  BEQ bra_F512
bra_F511_RTS:
F511  RTS
bra_F512:
F512  LDA ram_00EC
F514  BNE bra_F591
F516  LDA ram_00EF
F518  BNE bra_F597
bra_F51A_loop:
loc_F51A:
F51A  LDY ram_00ED
F51C  BNE bra_F525
F51E  LDA (ram_0007),Y
F520  STA ram_0057
F522  INC ram_03A4
bra_F525:
loc_F525:
F525  LDA ram_0041
F527  CMP #$09
F529  BNE bra_F53A
F52B  LDA ram_03BC
F52E  BEQ bra_F53A
F530  LDA #$00
F532  STA ram_00EE
F534  STA ram_00ED
F536  LDA #$7F
F538  BNE bra_F58D    ; jmp
bra_F53A:
F53A  INC ram_00ED
F53C  LDY ram_00ED
F53E  LDA (ram_0007),Y
F540  BEQ bra_F511_RTS
F542  BIT tbl_F3D8
F545  BEQ bra_F54B
F547  LDA ram_0046
F549  BEQ bra_F51A_loop
bra_F54B:
F54B  LDA (ram_0007),Y
F54D  BIT tbl_F0B5
F550  BEQ bra_F576
F552  AND #$0F
F554  TAX
F555  LDA tbl_F4C6,X
F558  STA ram_00EE
F55A  INC ram_00ED
F55C  INY
F55D  LDA ram_0041
F55F  CMP #$09
F561  BNE bra_F572
F563  CPY #$02
F565  BNE bra_F572
F567  LDA #$01
F569  STA ram_0057
F56B  LDA (ram_0007),Y
F56D  SEC
F56E  SBC #$3D
F570  BNE bra_F58D
bra_F572:
F572  LDA (ram_0007),Y
F574  BNE bra_F58D
bra_F576:
F576  LDX #$01
F578  AND #$3F
F57A  STA ram_00EE
F57C  CMP #$30
F57E  BCC bra_F597
F580  BNE bra_F587
F582  LDA ram_03BC
F585  BEQ bra_F588
bra_F587:
F587  DEX
bra_F588:
F588  STX ram_03A8
F58B  BPL bra_F51A_loop
bra_F58D:
F58D  AND #$7F
F58F  STA ram_00EC
bra_F591:
F591  LDA #$00
F593  STA ram_00EF
F595  DEC ram_00EC
bra_F597:
F597  LDX ram_00EE
F599  JSR sub_F82E
F59C  LDY ram_00EF
F59E  LDA (ram_0005),Y
F5A0  BNE bra_F5A5
F5A2  JMP loc_F62D
bra_F5A5:
F5A5  JSR sub_F676
F5A8  LDA (ram_0005),Y
F5AA  TAX
F5AB  JSR sub_F681
F5AE  LDA ram_00EE
F5B0  BEQ bra_F5BA
F5B2  CMP #$18
F5B4  BEQ bra_F5BA
F5B6  CMP #$1A
F5B8  BNE bra_F5C9
bra_F5BA:
F5BA  LDA ram_03A2
F5BD  EOR #$01
F5BF  STA ram_03A2
F5C2  BNE bra_F5C9
F5C4  LDA #$83
F5C6  STA ram_030A
bra_F5C9:
F5C9  INY
F5CA  STY ram_00EF
F5CC  LDA ram_00EE
F5CE  CMP #$09
F5D0  BNE bra_F5F6
F5D2  LDA ram_0057
F5D4  CMP #$01
F5D6  BEQ bra_F5F6
F5D8  CPY #$25
F5DA  BCC bra_F5F6
F5DC  CPY #$58
F5DE  BCS bra_F5F6
F5E0  LDX ram_03A5
F5E3  LDA tbl_F4CD,X
F5E6  STA ram_0310
F5E9  INC ram_03A5
F5EC  CPX #$05
F5EE  BNE bra_F5F6
F5F0  LDA ram_03A4
F5F3  STA ram_0310
bra_F5F6:
F5F6  LDA #$8E
F5F8  STA ram_0303
F5FB  LDA ram_00EA
F5FD  STA ram_0301
F600  LDA ram_00E9
F602  STA ram_0302
F605  LDA ram_00E8
F607  STA ram_000F
F609  JSR sub_F64E
F60C  LDA ram_00E8
F60E  JSR sub_ECBF
F611  STA ram_00E8
F613  INC ram_00E9
F615  LDA ram_00E9
F617  CMP #$20
F619  BNE bra_F625
F61B  LDA #$00
F61D  STA ram_00E9
F61F  LDA ram_00EA
F621  EOR #$04
F623  STA ram_00EA
bra_F625:
F625  LDA ram_00E0
F627  JSR sub_ECBF
F62A  STA ram_00EB
F62C  RTS
loc_F62D:
F62D  STA ram_00EF
F62F  LDA ram_00EE
F631  CMP #$09
F633  BEQ bra_F638
F635  JMP loc_F51A
bra_F638:
F638  INC ram_03A4
F63B  DEC ram_0057
F63D  BNE bra_F644
F63F  LDA #$01
F641  STA ram_03BC
bra_F644:
F644  LDA #$00
F646  STA ram_00ED
F648  STA ram_03A5
F64B  JMP loc_F525
sub_F64E:
F64E  LDX #$05
F650  LDA #$0D
F652  STA ram_000C
bra_F654_loop:
F654  TXA
F655  TAY
F656  JSR sub_E80D
F659  STX ram_000A
bra_F65B_loop:
F65B  LDX ram_000C
F65D  LDA ram_0304,X
F660  CMP #$FC
F662  BNE bra_F66A
F664  DEC ram_000C
F666  LDA ram_000C
F668  BPL bra_F65B_loop
bra_F66A:
F66A  LDY ram_000F
F66C  STA (ram_0003),Y
F66E  DEC ram_000C
F670  LDX ram_000A
F672  DEX
F673  BPL bra_F654_loop
F675  RTS
sub_F676:
F676  LDX #$0A
F678  LDA #$FC
bra_F67A_loop:
F67A  STA ram_0304 - $01,X
F67D  DEX
F67E  BNE bra_F67A_loop
F680  RTS
sub_F681:
bra_F681_loop:
F681  INY
F682  LDA (ram_0005),Y
F684  STA ram_0303,X
F687  INX
F688  CPX #$0F
F68A  BNE bra_F681_loop
bra_F68C_RTS:
F68C  RTS
sub_F68D:
F68D  LDA ram_00BE
F68F  BEQ bra_F68C_RTS
F691  LDA ram_00CA
F693  BNE bra_F6C7
F695  LDA ram_00C3
F697  BNE bra_F6C7
F699  LDX ram_00C8
F69B  TXA
F69C  BEQ bra_F6C7
F69E  DEX
F69F  JSR sub_F839
F6A2  LDY ram_00C9
F6A4  LDA (ram_0007),Y
F6A6  BNE bra_F6AB
F6A8  JMP loc_F71E
bra_F6AB:
F6AB  BIT tbl_F0B5
F6AE  BEQ bra_F6C2
F6B0  AND #$0F
F6B2  TAX
F6B3  LDA tbl_F4C6,X
F6B6  STA ram_00B8
F6B8  INY
F6B9  LDA (ram_0007),Y
F6BB  STA ram_00CA
F6BD  INY
F6BE  STY ram_00C9
F6C0  BNE bra_F6C7
bra_F6C2:
F6C2  STA ram_00B8
F6C4  INY
F6C5  STY ram_00C9
bra_F6C7:
F6C7  LDX ram_00B8
F6C9  JSR sub_F82E
F6CC  LDY ram_00C3
F6CE  LDA (ram_0005),Y
F6D0  BEQ bra_F70E
F6D2  JSR sub_F676
F6D5  LDA (ram_0005),Y
F6D7  TAX
F6D8  JSR sub_F681
F6DB  INY
F6DC  STY ram_00C3
F6DE  LDA #$8E
F6E0  STA ram_0303
F6E3  LDA ram_00B0
F6E5  STA ram_0301
F6E8  LDA ram_00B1
F6EA  STA ram_0302
F6ED  LDA ram_00B2
F6EF  STA ram_000F
F6F1  JSR sub_F64E
F6F4  LDA ram_00B2
F6F6  JSR sub_ECBF
F6F9  STA ram_00B2
sub_F6FB:
F6FB  INC ram_00B1
F6FD  LDA ram_00B1
F6FF  CMP #$20
F701  BNE bra_F70D_RTS
F703  LDA #$00
F705  STA ram_00B1
F707  LDA ram_00B0
F709  EOR #$04
F70B  STA ram_00B0
bra_F70D_RTS:
F70D  RTS
bra_F70E:
F70E  LDA ram_00C8
F710  BEQ bra_F71E
F712  LDA #$00
F714  STA ram_00C3
F716  LDA ram_00CA
F718  BEQ bra_F739
F71A  DEC ram_00CA
F71C  BPL bra_F739
bra_F71E:
loc_F71E:
F71E  LDY ram_00B2
F720  JSR sub_ECC9
F723  BNE bra_F731
F725  INY
F726  CPY #$40
F728  BNE bra_F72C
F72A  LDY #$00
bra_F72C:
F72C  JSR sub_ECC9
F72F  BEQ bra_F73E
bra_F731:
F731  LDA #$00
F733  STA ram_00B8
F735  STA ram_00C3
F737  STA ram_00C8
bra_F739:
F739  LDA #$01
F73B  STA ram_00BE
F73D  RTS
bra_F73E:
F73E  LDA #$00
F740  STA ram_00C3
F742  STA ram_00BE
F744  STA ram_00BD
F746  STA ram_00C8
F748  LDA ram_00BA
F74A  STA ram_00B2
F74C  LDA ram_00BB
F74E  STA ram_00B0
F750  LDA ram_00BC
F752  STA ram_00B1
F754  RTS
sub_F755:
F755  LDA ram_00B4
F757  BNE bra_F798_RTS
F759  LDA ram_00C0
F75B  BEQ bra_F798_RTS
F75D  LDX #$15
bra_F75F_loop:
F75F  JSR sub_F82E
F762  LDY #$00
F764  LDA (ram_0005),Y
F766  STA ram_0003
F768  LDA #$0F
F76A  SEC
F76B  SBC ram_0003
F76D  TAY
F76E  STX ram_0004
F770  LDX ram_00B3
F772  LDA (ram_0005),Y
F774  CMP ram_0540,X
F777  BNE bra_F792
F779  DEY
F77A  DEY
F77B  DEY
F77C  LDA (ram_0005),Y
F77E  CMP ram_0480,X
F781  BNE bra_F792
F783  DEY
F784  DEY
F785  LDA (ram_0005),Y
F787  CMP ram_0400,X
F78A  BNE bra_F792
F78C  LDA ram_0004
F78E  STA ram_00C7
F790  BPL bra_F799
bra_F792:
F792  DEC ram_0004
F794  LDX ram_0004
F796  BPL bra_F75F_loop
bra_F798_RTS:
F798  RTS
bra_F799:
F799  LDA ram_00C4
F79B  BNE bra_F7AC
F79D  LDA ram_00C7
F79F  STA ram_00C6
F7A1  LDX ram_00B7
F7A3  JSR sub_F821
F7A6  LDA #$3D
F7A8  STA ram_00C5
F7AA  INC ram_00C4
bra_F7AC:
F7AC  LDA ram_00C7
F7AE  CMP ram_00C6
F7B0  BNE bra_F7C9
F7B2  LDA ram_00C6
F7B4  BNE bra_F798_RTS
F7B6  INC ram_00C5
F7B8  LDA ram_00C5
F7BA  CMP #$7F
F7BC  BCC bra_F7FA
F7BE  LDX ram_00B7
F7C0  STA ram_05E0,X
F7C3  INX
F7C4  JSR sub_F821
F7C7  BEQ bra_F7FA
bra_F7C9:
F7C9  LDA ram_00C6
F7CB  BNE bra_F7E7
F7CD  LDX ram_00B7
F7CF  LDA ram_00C5
F7D1  STA ram_05E0,X
F7D4  INX
F7D5  STX ram_00B7
F7D7  LDA ram_00C7
F7D9  CMP #$11
F7DB  BCS bra_F809
F7DD  LDA ram_00C7
F7DF  STA ram_05E0,X
F7E2  JSR sub_F826
F7E5  BEQ bra_F7EC
bra_F7E7:
F7E7  LDX ram_00B7
F7E9  JSR sub_F821
bra_F7EC:
F7EC  LDA ram_00C7
F7EE  STA ram_00C6
F7F0  CMP #$09
F7F2  BNE bra_F7FA
F7F4  LDA #$02
F7F6  STA ram_00BF
F7F8  STA ram_0049
bra_F7FA:
F7FA  LDA ram_00B7
F7FC  CMP #$ED
F7FE  BCC bra_F808_RTS
F800  LDA ram_00C1
F802  BNE bra_F808_RTS
F804  LDA #$01
F806  STA ram_00C1
bra_F808_RTS:
F808  RTS
bra_F809:
F809  AND #$0F
F80B  TAX
F80C  DEX
F80D  JSR sub_F839
F810  LDY #$00
bra_F812_loop:
F812  LDX ram_00B7
F814  LDA (ram_0007),Y
F816  BEQ bra_F7EC
F818  STA ram_05E0,X
F81B  INX
F81C  STX ram_00B7
F81E  INY
F81F  BNE bra_F812_loop
sub_F821:
F821  LDA #$40
F823  STA ram_05E0,X
sub_F826:
F826  INX
F827  STX ram_00B7
F829  LDA #$00
F82B  STA ram_00C5
F82D  RTS
sub_F82E:
F82E  LDA tbl_F063_lo,X
F831  STA ram_0005
F833  LDA tbl_F087_hi,X
F836  STA ram_0006
F838  RTS
sub_F839:
F839  LDA tbl_F4F5_lo,X
F83C  STA ram_0007
F83E  LDA tbl_F4FA_hi,X
F841  STA ram_0008
F843  RTS
sub_F844:
F844  LDA #$C0
F846  STA $4017
F849  JSR sub_F8D4
F84C  JSR sub_FA74
F84F  JSR sub_FC3D
F852  JSR sub_FC8D
F855  LDA #$00
F857  STA ram_00FF
F859  STA ram_00FE
F85B  STA ram_00FD
F85D  STA ram_00FB
F85F  LDA ram_07FF
F862  BEQ bra_F86A_RTS
F864  STA $4011
F867  DEC ram_07FF
bra_F86A_RTS:
F86A  RTS
loc_F86B:
sub_F86B:
F86B  STX $4000
F86E  STY $4001
sub_F871:
F871  LDX #$00
bra_F873:
F873  TAY
F874  LDA tbl_FF00 + $01,Y
F877  BEQ bra_F884_RTS
F879  STA $4002,X
F87C  LDA tbl_FF00,Y
F87F  ORA #$08
F881  STA $4003,X
bra_F884_RTS:
F884  RTS
sub_F885:
F885  LDX #$04
F887  BNE bra_F873    ; jmp
sub_F889:
F889  LDX #$08
F88B  BNE bra_F873    ; jmp
bra_F88D:
F88D  STY ram_00F0
F88F  LDA #$01
F891  STA ram_00F5
F893  LDX #$80
F895  LDY #$9C
F897  LDA #$04
F899  JMP loc_F86B
bra_F89C:
F89C  STY ram_00F0
F89E  LDA #$10
F8A0  STA ram_00F5
F8A2  LDX #$85
F8A4  LDY #$85
F8A6  LDA #$30
F8A8  JSR sub_F86B
bra_F8AB:
F8AB  JMP loc_F93A
bra_F8AE:
F8AE  STY ram_00F0
F8B0  LDA #$09
F8B2  STA ram_00F5
F8B4  LDA #$04
F8B6  JSR sub_F871
bra_F8B9:
F8B9  LDA ram_00F5
F8BB  CMP #$04
F8BD  BNE bra_F8C2
F8BF  JMP loc_F93E
bra_F8C2:
F8C2  LDY #$84
F8C4  CMP #$07
F8C6  BCS bra_F8CA
F8C8  LDY #$8B
bra_F8CA:
F8CA  STY $4001
F8CD  ORA #$90
F8CF  STA $4000
F8D2  BNE bra_F93A    ; jmp
sub_F8D4:
F8D4  LDY ram_00F4
F8D6  BNE bra_F90D_RTS
F8D8  LDY ram_00FF
F8DA  LDA ram_00F0
F8DC  LSR ram_00FF
F8DE  BCS bra_F88D
F8E0  LSR
F8E1  BCS bra_F93A
F8E3  LSR ram_00FF
F8E5  BCS bra_F89C
F8E7  LSR
F8E8  BCS bra_F8AB
F8EA  LSR
F8EB  BCS bra_F8B9
F8ED  LSR ram_00FF
F8EF  BCS bra_F8AE
F8F1  LSR ram_00FF
F8F3  BCS bra_F90E
F8F5  LSR
F8F6  BCS bra_F921
F8F8  LSR ram_00FF
F8FA  BCS bra_F948
F8FC  LSR
F8FD  BCS bra_F95B
F8FF  LSR ram_00FF
F901  BCS bra_F96D
F903  LSR
F904  BCS bra_F975
F906  LSR ram_00FF
F908  BCS bra_F97D
F90A  LSR
F90B  BCS bra_F98A
bra_F90D_RTS:
F90D  RTS
bra_F90E:
F90E  STY ram_00F0
F910  LDA #$06
F912  STA ram_00F5
F914  LDX #$9C
F916  LDA #$3C
F918  JSR sub_F86B
F91B  LDA #$03
F91D  STA ram_00F6
F91F  BNE bra_F92B
bra_F921:
F921  DEC ram_00F6
F923  BEQ bra_F931
F925  LDA ram_00F6
F927  CMP #$03
F929  BNE bra_F90D_RTS
bra_F92B:
F92B  LDA #$9A
bra_F92D:
F92D  STA $4001
F930  RTS
bra_F931:
F931  LDA #$93
bra_F933:
F933  STA $4001
F936  LDA #$06
F938  STA ram_00F6
bra_F93A:
loc_F93A:
F93A  DEC ram_00F5
F93C  BNE bra_F947_RTS
loc_F93E:
F93E  LDA #$00
F940  STA ram_00F0
loc_F942:
F942  LDA #$90
F944  STA $4000
bra_F947_RTS:
F947  RTS
bra_F948:
F948  STY ram_00F0
F94A  LDA #$03
F94C  STA ram_00F5
bra_F94E:
F94E  LDX #$9C
F950  LDA #$00
F952  JSR sub_F86B
F955  LDA #$04
F957  STA ram_00F6
F959  BNE bra_F965
bra_F95B:
F95B  DEC ram_00F6
F95D  BEQ bra_F969
bra_F95F:
F95F  LDA ram_00F6
F961  CMP #$04
F963  BNE bra_F90D_RTS
bra_F965:
F965  LDA #$9A
F967  BNE bra_F92D    ; jmp
bra_F969:
F969  LDA #$93
F96B  BNE bra_F933    ; jmp
bra_F96D:
F96D  STY ram_00F0
F96F  LDA #$02
F971  STA ram_00F5
F973  BNE bra_F94E    ; jmp
bra_F975:
F975  DEC ram_00F6
F977  BNE bra_F95F
F979  LDA #$94
F97B  BNE bra_F933    ; jmp
bra_F97D:
F97D  STY ram_00F0
F97F  LDA #$21
F981  STA ram_00F5
F983  LDY #$BC
F985  LDA #$30
F987  JSR sub_F86B
bra_F98A:
F98A  LDA ram_00F5
F98C  CMP #$15
F98E  BNE bra_F995
F990  LDY #$7F
F992  STY $4001
bra_F995:
F995  LSR
F996  TAY
F997  LDA tbl_F9A3 - $01,Y
F99A  BCS bra_F99E
F99C  LDA #$13
bra_F99E:
F99E  STA $4000
F9A1  BNE bra_F93A    ; jmp
tbl_F9A3:
F9A3  .byte $91   ; 
F9A4  .byte $92   ; 
F9A5  .byte $93   ; 
F9A6  .byte $94   ; 
F9A7  .byte $95   ; 
F9A8  .byte $96   ; 
F9A9  .byte $97   ; 
F9AA  .byte $98   ; 
F9AB  .byte $9A   ; 
F9AC  .byte $9C   ; 
F9AD  .byte $9F   ; 
F9AE  .byte $9C   ; 
F9AF  .byte $9A   ; 
F9B0  .byte $98   ; 
F9B1  .byte $96   ; 
F9B2  .byte $94   ; 
tbl_F9B3:
F9B3  .byte $00   ; 
F9B4  .byte $02   ; 
F9B5  .byte $04   ; 
F9B6  .byte $02   ; 
F9B7  .byte $00   ; 
F9B8  .byte $FE   ; 
tbl_F9B9:
F9B9  .byte $94   ; 
F9BA  .byte $96   ; 
F9BB  .byte $94   ; 
F9BC  .byte $93   ; 
F9BD  .byte $92   ; 
F9BE  .byte $91   ; 
tbl_F9BF:
F9BF  .byte $1C   ; 
F9C0  .byte $54   ; 
F9C1  .byte $16   ; 
F9C2  .byte $52   ; 
F9C3  .byte $12   ; 
tbl_F9C4:
F9C4  .byte $18   ; 
F9C5  .byte $18   ; 
F9C6  .byte $20   ; 
F9C7  .byte $28   ; 
F9C8  .byte $30   ; 
F9C9  .byte $32   ; 
F9CA  .byte $34   ; 
F9CB  .byte $36   ; 
F9CC  .byte $38   ; 
F9CD  .byte $39   ; 
F9CE  .byte $3A   ; 
F9CF  .byte $3B   ; 
F9D0  .byte $3C   ; 
F9D1  .byte $3D   ; 
F9D2  .byte $3E   ; 
F9D3  .byte $3F   ; 
F9D4  .byte $40   ; 
F9D5  .byte $41   ; 
F9D6  .byte $42   ; 
F9D7  .byte $43   ; 
F9D8  .byte $44   ; 
F9D9  .byte $45   ; 
F9DA  .byte $46   ; 
F9DB  .byte $47   ; 
F9DC  .byte $48   ; 
F9DD  .byte $49   ; 
F9DE  .byte $4A   ; 
F9DF  .byte $4B   ; 
F9E0  .byte $4C   ; 
F9E1  .byte $4D   ; 
F9E2  .byte $4E   ; 
F9E3  .byte $4F   ; 
F9E4  .byte $50   ; 
F9E5  .byte $51   ; 
F9E6  .byte $52   ; 
F9E7  .byte $53   ; 
F9E8  .byte $54   ; 
F9E9  .byte $55   ; 
F9EA  .byte $56   ; 
F9EB  .byte $57   ; 
F9EC  .byte $58   ; 
F9ED  .byte $59   ; 
F9EE  .byte $5A   ; 
F9EF  .byte $5B   ; 
F9F0  .byte $5C   ; 
F9F1  .byte $5D   ; 
F9F2  .byte $5E   ; 
F9F3  .byte $5F   ; 
tbl_F9F4:
F9F4  .byte $70   ; 
F9F5  .byte $05   ; 
F9F6  .byte $04   ; 
F9F7  .byte $03   ; 
F9F8  .byte $02   ; 
F9F9  .byte $02   ; 
F9FA  .byte $02   ; 
F9FB  .byte $02   ; 
F9FC  .byte $02   ; 
F9FD  .byte $02   ; 
F9FE  .byte $02   ; 
F9FF  .byte $02   ; 
FA00  .byte $02   ; 
FA01  .byte $02   ; 
FA02  .byte $02   ; 
FA03  .byte $02   ; 
FA04  .byte $02   ; 
FA05  .byte $02   ; 
FA06  .byte $02   ; 
FA07  .byte $02   ; 
FA08  .byte $02   ; 
FA09  .byte $02   ; 
FA0A  .byte $02   ; 
FA0B  .byte $02   ; 
FA0C  .byte $02   ; 
FA0D  .byte $02   ; 
FA0E  .byte $02   ; 
FA0F  .byte $02   ; 
FA10  .byte $02   ; 
FA11  .byte $02   ; 
FA12  .byte $02   ; 
FA13  .byte $02   ; 
FA14  .byte $01   ; 
FA15  .byte $01   ; 
FA16  .byte $01   ; 
FA17  .byte $01   ; 
FA18  .byte $01   ; 
FA19  .byte $01   ; 
FA1A  .byte $01   ; 
FA1B  .byte $01   ; 
FA1C  .byte $01   ; 
FA1D  .byte $01   ; 
FA1E  .byte $01   ; 
FA1F  .byte $01   ; 
FA20  .byte $01   ; 
FA21  .byte $01   ; 
FA22  .byte $01   ; 
FA23  .byte $01   ; 
tbl_FA24:
FA24  .byte $00   ; 
FA25  .byte $94   ; 
FA26  .byte $96   ; 
FA27  .byte $98   ; 
FA28  .byte $9C   ; 
FA29  .byte $80   ; 
FA2A  .byte $80   ; 
FA2B  .byte $80   ; 
FA2C  .byte $80   ; 
FA2D  .byte $80   ; 
FA2E  .byte $9E   ; 
FA2F  .byte $9D   ; 
FA30  .byte $9C   ; 
FA31  .byte $9B   ; 
FA32  .byte $9A   ; 
FA33  .byte $99   ; 
FA34  .byte $98   ; 
FA35  .byte $97   ; 
FA36  .byte $96   ; 
FA37  .byte $95   ; 
FA38  .byte $95   ; 
tbl_FA39:
FA39  .byte $94   ; 
FA3A  .byte $30   ; 
FA3B  .byte $38   ; 
FA3C  .byte $40   ; 
FA3D  .byte $48   ; 
FA3E  .byte $50   ; 
FA3F  .byte $54   ; 
FA40  .byte $58   ; 
FA41  .byte $50   ; 
FA42  .byte $4C   ; 
FA43  .byte $48   ; 
FA44  .byte $44   ; 
FA45  .byte $40   ; 
FA46  .byte $3C   ; 
FA47  .byte $38   ; 
FA48  .byte $34   ; 
FA49  .byte $30   ; 
FA4A  .byte $2C   ; 
FA4B  .byte $2A   ; 
FA4C  .byte $28   ; 
FA4D  .byte $26   ; 
FA4E  .byte $24   ; 
bra_FA4F:
FA4F  LDY #$15
FA51  STY ram_00F1
FA53  BNE bra_FA5E    ; jmp
bra_FA55:
FA55  DEC ram_07F3
FA58  BNE bra_FA8F
FA5A  DEC ram_00F1
FA5C  BEQ bra_FA8F
bra_FA5E:
FA5E  LDX tbl_FA24,Y
FA61  LDA #$01
FA63  CPX #$80
FA65  BNE bra_FA69
FA67  LDA #$02
bra_FA69:
FA69  STA ram_07F3
FA6C  LDA tbl_FA39,Y
FA6F  LDY #$7F
FA71  JMP loc_FAF7
sub_FA74:
FA74  LDY ram_00FE
FA76  BNE bra_FA4F
FA78  LDY ram_00F1
FA7A  BNE bra_FA55
FA7C  LDA ram_00FC
FA7E  AND #$7F
FA80  BNE bra_FA95
FA82  LDA ram_00F3
FA84  BEQ bra_FA94_RTS
FA86  LDA #$00
FA88  STA ram_00F3
FA8A  STA ram_00F7
FA8C  STA ram_07F8
bra_FA8F:
FA8F  LDA #$90
FA91  STA $4004
bra_FA94_RTS:
FA94  RTS
bra_FA95:
FA95  LDY ram_00F7
FA97  INC ram_00F7
FA99  CPY ram_07F8
FA9C  BNE bra_FACF
FA9E  CMP #$30
FAA0  BCS bra_FABF
FAA2  SEC
FAA3  SBC ram_00F3
FAA5  BEQ bra_FAC3
FAA7  BCS bra_FAB3
FAA9  DEC ram_00F3
FAAB  CMP #$F8
FAAD  BCS bra_FABB
FAAF  DEC ram_00F3
FAB1  BNE bra_FABB
bra_FAB3:
FAB3  INC ram_00F3
FAB5  CMP #$08
FAB7  BCC bra_FABB
FAB9  INC ram_00F3
bra_FABB:
FABB  LDA #$01
FABD  BNE bra_FAC8    ; jmp
bra_FABF:
FABF  LDA #$30
FAC1  STA ram_00F3
bra_FAC3:
FAC3  LDY ram_00F3
FAC5  LDA tbl_F9F4,Y
bra_FAC8:
FAC8  STA ram_07F8
FACB  LDA #$00
FACD  STA ram_00F7
bra_FACF:
FACF  LDA ram_07FF
FAD2  CLC
FAD3  ADC #$04
FAD5  CMP #$40
FAD7  BCS bra_FADC
FAD9  STA ram_07FF
bra_FADC:
FADC  LDY ram_00F3
FADE  LDA tbl_F9C4,Y
FAE1  LDY ram_00F7
FAE3  CLC
FAE4  ADC tbl_F9B3,Y
FAE7  LDX ram_00FC
FAE9  BPL bra_FAF2
FAEB  LDX tbl_F9BF,Y
FAEE  LDY #$89
FAF0  BNE bra_FAF7
bra_FAF2:
FAF2  LDX tbl_F9B9,Y
FAF5  LDY #$7F
bra_FAF7:
loc_FAF7:
FAF7  STX $4004
FAFA  STY $4005
FAFD  STA ram_07F9
FB00  LDY #$07
FB02  STY ram_0000
FB04  LDY #$FF
FB06  STY ram_0001
FB08  LSR
FB09  LSR
FB0A  LSR
FB0B  LSR
FB0C  LSR
FB0D  TAY
FB0E  BEQ bra_FB17
bra_FB10_loop:
FB10  LSR ram_0000
FB12  ROR ram_0001
FB14  DEY
FB15  BNE bra_FB10_loop
bra_FB17:
FB17  LDA ram_0000
FB19  LSR
FB1A  TAX
FB1B  LDA ram_0001
FB1D  ROR
FB1E  TAY
FB1F  ASL ram_07F9
FB22  ASL ram_07F9
FB25  ASL ram_07F9
bra_FB28_loop:
FB28  TXA
FB29  LSR
FB2A  TAX
FB2B  TYA
FB2C  ROR
FB2D  TAY
FB2E  ASL ram_07F9
FB31  BCC bra_FB41
FB33  SEC
FB34  EOR #$FF
FB36  ADC ram_0001
FB38  STA ram_0001
FB3A  TXA
FB3B  EOR #$FF
FB3D  ADC ram_0000
FB3F  STA ram_0000
bra_FB41:
FB41  LDA ram_07F9
FB44  BNE bra_FB28_loop
FB46  LDA ram_0001
FB48  STA $4006
FB4B  LDA ram_0000
FB4D  STA $4007
FB50  LDA ram_00F1
FB52  BNE bra_FB5A
FB54  LDA ram_00F7
FB56  ORA ram_00FA
FB58  BNE bra_FB76_RTS
bra_FB5A:
FB5A  LSR ram_0000
FB5C  ROR ram_0001
FB5E  LDA ram_0000
FB60  LSR
FB61  TAY
FB62  LDA ram_0001
FB64  ROR
FB65  CLC
FB66  ADC ram_0001
FB68  STA $400A
FB6B  TYA
FB6C  ADC ram_0000
FB6E  STA $400B
FB71  LDA #$04
FB73  STA $4008
bra_FB76_RTS:
FB76  RTS
tbl_FB77:
FB77  .byte $10   ; 
FB78  .byte $11   ; 
FB79  .byte $12   ; 
FB7A  .byte $12   ; 
FB7B  .byte $12   ; 
FB7C  .byte $13   ; 
FB7D  .byte $13   ; 
FB7E  .byte $14   ; 
FB7F  .byte $15   ; 
FB80  .byte $16   ; 
FB81  .byte $17   ; 
FB82  .byte $18   ; 
FB83  .byte $19   ; 
FB84  .byte $1A   ; 
FB85  .byte $1B   ; 
FB86  .byte $1C   ; 
FB87  .byte $1D   ; 
FB88  .byte $1E   ; 
FB89  .byte $1F   ; 
FB8A  .byte $1C   ; 
FB8B  .byte $1F   ; 
FB8C  .byte $1F   ; 
FB8D  .byte $1F   ; 
FB8E  .byte $1F   ; 
FB8F  .byte $1F   ; 
FB90  .byte $18   ; 
FB91  .byte $1F   ; 
FB92  .byte $1F   ; 
FB93  .byte $1F   ; 
FB94  .byte $1F   ; 
FB95  .byte $18   ; 
FB96  .byte $1C   ; 
FB97  .byte $1F   ; 
FB98  .byte $1F   ; 
FB99  .byte $18   ; 
FB9A  .byte $1F   ; 
FB9B  .byte $1F   ; 
FB9C  .byte $1F   ; 
FB9D  .byte $14   ; 
FB9E  .byte $1F   ; 
FB9F  .byte $1C   ; 
FBA0  .byte $1F   ; 
FBA1  .byte $1F   ; 
FBA2  .byte $1C   ; 
FBA3  .byte $18   ; 
FBA4  .byte $16   ; 
tbl_FBA5:
FBA5  .byte $0E   ; 
FBA6  .byte $0C   ; 
FBA7  .byte $0E   ; 
FBA8  .byte $0E   ; 
FBA9  .byte $0A   ; 
FBAA  .byte $0C   ; 
FBAB  .byte $0E   ; 
FBAC  .byte $0E   ; 
FBAD  .byte $0C   ; 
FBAE  .byte $0A   ; 
FBAF  .byte $0E   ; 
FBB0  .byte $0D   ; 
FBB1  .byte $0E   ; 
FBB2  .byte $0E   ; 
FBB3  .byte $0E   ; 
FBB4  .byte $0E   ; 
FBB5  .byte $0C   ; 
FBB6  .byte $0E   ; 
FBB7  .byte $0A   ; 
FBB8  .byte $0E   ; 
FBB9  .byte $0C   ; 
FBBA  .byte $0C   ; 
FBBB  .byte $0E   ; 
FBBC  .byte $0D   ; 
FBBD  .byte $0C   ; 
FBBE  .byte $0D   ; 
FBBF  .byte $0D   ; 
FBC0  .byte $0E   ; 
FBC1  .byte $0E   ; 
FBC2  .byte $0D   ; 
FBC3  .byte $0D   ; 
FBC4  .byte $0E   ; 
FBC5  .byte $0B   ; 
FBC6  .byte $0E   ; 
FBC7  .byte $0E   ; 
FBC8  .byte $0D   ; 
FBC9  .byte $0E   ; 
FBCA  .byte $0E   ; 
FBCB  .byte $0C   ; 
FBCC  .byte $0D   ; 
FBCD  .byte $0E   ; 
FBCE  .byte $0B   ; 
FBCF  .byte $0D   ; 
FBD0  .byte $0E   ; 
FBD1  .byte $0E   ; 
FBD2  .byte $0D   ; 
tbl_FBD3:
FBD3  .byte $30   ; 
FBD4  .byte $31   ; 
FBD5  .byte $32   ; 
FBD6  .byte $32   ; 
FBD7  .byte $33   ; 
FBD8  .byte $33   ; 
FBD9  .byte $34   ; 
FBDA  .byte $35   ; 
FBDB  .byte $36   ; 
FBDC  .byte $37   ; 
FBDD  .byte $38   ; 
FBDE  .byte $37   ; 
FBDF  .byte $38   ; 
FBE0  .byte $37   ; 
FBE1  .byte $36   ; 
FBE2  .byte $35   ; 
FBE3  .byte $34   ; 
FBE4  .byte $34   ; 
FBE5  .byte $34   ; 
FBE6  .byte $35   ; 
FBE7  .byte $36   ; 
FBE8  .byte $37   ; 
FBE9  .byte $38   ; 
FBEA  .byte $39   ; 
FBEB  .byte $3A   ; 
FBEC  .byte $3B   ; 
FBED  .byte $3C   ; 
FBEE  .byte $3A   ; 
FBEF  .byte $38   ; 
FBF0  .byte $36   ; 
FBF1  .byte $35   ; 
tbl_FBF2:
FBF2  .byte $34   ; 
FBF3  .byte $10   ; 
FBF4  .byte $11   ; 
FBF5  .byte $12   ; 
FBF6  .byte $14   ; 
FBF7  .byte $16   ; 
FBF8  .byte $18   ; 
FBF9  .byte $1C   ; 
FBFA  .byte $1F   ; 
FBFB  .byte $1C   ; 
FBFC  .byte $18   ; 
FBFD  .byte $16   ; 
FBFE  .byte $14   ; 
bra_FBFF:
FBFF  STY ram_00F2
FC01  LDA #$2E
FC03  STA ram_07F6
bra_FC06:
FC06  TYA
FC07  BEQ bra_FC0E
FC09  AND #$02
FC0B  STA ram_07F7
bra_FC0E:
FC0E  LDY ram_07F6
FC11  LDA tbl_FB77 - $01,Y
FC14  STA $400C
FC17  LDA tbl_FBA5 - $01,Y
FC1A  STA $400E
FC1D  BNE bra_FC75    ; jmp
bra_FC1F:
FC1F  STY ram_00F2
FC21  LDA #$00
FC23  STA ram_07F6
FC26  STA ram_07F7
FC29  LDA #$0E
FC2B  STA $400E
bra_FC2E:
FC2E  LDA ram_07F6
FC31  LSR
FC32  LSR
FC33  LSR
FC34  TAY
FC35  LDA tbl_FBD3,Y
FC38  STA $400C
FC3B  BNE bra_FC75    ; jmp
sub_FC3D:
FC3D  LDY ram_00FD
FC3F  LDA ram_00F2
FC41  LSR ram_00FD
FC43  BCS bra_FBFF
FC45  LSR
FC46  BCS bra_FC06
FC48  LSR ram_00FD
FC4A  BCS bra_FC1F
FC4C  LSR
FC4D  BCS bra_FC2E
FC4F  LSR
FC50  BCS bra_FC63
FC52  LSR ram_00FD
FC54  BCS bra_FC57
bra_FC56_RTS:
FC56  RTS
bra_FC57:
FC57  STY ram_00F2
FC59  LDA #$0C
FC5B  STA ram_07F6
FC5E  LDA #$0D
FC60  STA $400E
bra_FC63:
FC63  LDY ram_07F6
FC66  LDA tbl_FBF2,Y
FC69  STA $400C
FC6C  CPY #$08
FC6E  BNE bra_FC75
FC70  LDA #$0E
FC72  STA $400E
bra_FC75:
FC75  LDA #$08
FC77  STA $400F
FC7A  DEC ram_07F6
FC7D  BNE bra_FC56_RTS
FC7F  LDY ram_07F7
FC82  BNE bra_FC1F
FC84  LDA #$00
FC86  STA ram_00F2
FC88  RTS
tbl_FC89:
FC89  .byte $7F   ; 
FC8A  .byte $8E   ; 
FC8B  .byte $86   ; 
FC8C  .byte $8F   ; 
sub_FC8D:
FC8D  LDA ram_00FB
FC8F  BNE bra_FC96
FC91  LDA ram_00F4
FC93  BNE bra_FCD9
FC95  RTS
bra_FC96:
FC96  STA ram_00F4
FC98  LDY #$00
bra_FC9A_loop:
FC9A  INY
FC9B  LSR
FC9C  BCC bra_FC9A_loop
FC9E  LDA tbl_FDD3 - $01,Y
FCA1  TAY
FCA2  LDA tbl_FDDB - $08,Y
FCA5  STA ram_07F0
FCA8  LDA tbl_FDDB - $08 + $01,Y
FCAB  STA ram_00F8
FCAD  LDA tbl_FDDB - $08 + $02,Y
FCB0  STA ram_00F9
FCB2  LDA tbl_FDDB - $08 + $03,Y
FCB5  STA ram_07E0
FCB8  LDA tbl_FDDB - $08 + $04,Y
FCBB  STA ram_00FA
FCBD  LDA tbl_FDDB - $08 + $05,Y
FCC0  STA ram_07EC
FCC3  LDA #$01
FCC5  STA ram_07E5
FCC8  STA ram_07E1
FCCB  STA ram_07E9
FCCE  STA ram_07ED
FCD1  LDY #$00
FCD3  STY ram_07E4
FCD6  INC ram_07FB
bra_FCD9:
FCD9  LDY ram_07E0
FCDC  BEQ bra_FD1A
FCDE  DEC ram_07E1
FCE1  BNE bra_FD1A
FCE3  INC ram_07E0
FCE6  LDA (ram_00F8),Y
FCE8  JSR sub_FF53
FCEB  STA ram_07E1
FCEE  TXA
FCEF  AND #$3E
FCF1  JSR sub_F871
FCF4  BNE bra_FCFA
FCF6  LDX #$10
FCF8  BNE bra_FD04    ; jmp
bra_FCFA:
FCFA  LDX #$4F
FCFC  LDA ram_00F4
FCFE  AND #$60
FD00  BNE bra_FD04
FD02  LDX #$05
bra_FD04:
FD04  STX $4000
FD07  LDY #$7F
FD09  LDA ram_00F4
FD0B  LSR
FD0C  BCC bra_FD17
FD0E  LDA ram_07FB
FD11  AND #$03
FD13  TAX
FD14  LDY tbl_FC89,X
bra_FD17:
FD17  STY $4001
bra_FD1A:
FD1A  DEC ram_07E5
FD1D  BNE bra_FD63
FD1F  LDY ram_07E4
FD22  INC ram_07E4
FD25  LDA (ram_00F8),Y
FD27  BNE bra_FD32
FD29  LDA #$00
FD2B  STA ram_00FA
FD2D  STA ram_00F4
FD2F  JMP loc_F942
bra_FD32:
FD32  JSR sub_FF53
FD35  STA ram_07E5
FD38  LDA ram_00F4
FD3A  AND #$60
FD3C  BNE bra_FD63
FD3E  TXA
FD3F  AND #$3E
FD41  JSR sub_F885
FD44  BNE bra_FD4A
FD46  LDX #$10
FD48  BNE bra_FD5B    ; jmp
bra_FD4A:
FD4A  LDX #$87
FD4C  LDA ram_07E5
FD4F  CMP #$10
FD51  BCS bra_FD5B
FD53  LDX #$84
FD55  CMP #$08
FD57  BCS bra_FD5B
FD59  LDX #$82
bra_FD5B:
FD5B  STX $4004
FD5E  LDA #$7F
FD60  STA $4005
bra_FD63:
FD63  LDY ram_00FA
FD65  BEQ bra_FD99
FD67  DEC ram_07E9
FD6A  BNE bra_FD99
FD6C  INC ram_00FA
FD6E  LDA (ram_00F8),Y
FD70  JSR sub_FF53
FD73  STA ram_07E9
FD76  CLC
FD77  ADC #$FF
FD79  CMP #$0C
FD7B  BCC bra_FD7F
FD7D  LDA #$0C
bra_FD7F:
FD7F  ASL
FD80  ASL
FD81  LDY ram_00F4
FD83  CPY #$20
FD85  BNE bra_FD89
FD87  LDA #$81
bra_FD89:
FD89  STA $4008
FD8C  TXA
FD8D  AND #$3E
FD8F  JSR sub_F889
FD92  BNE bra_FD99
FD94  LDA #$00
FD96  STA $4008
bra_FD99:
FD99  LDA ram_00F4
FD9B  AND #$1B
FD9D  BEQ bra_FDD2_RTS
FD9F  DEC ram_07ED
FDA2  BNE bra_FDD2_RTS
FDA4  LDY ram_07EC
FDA7  INC ram_07EC
FDAA  LDA (ram_00F8),Y
FDAC  JSR sub_FF53
FDAF  STA ram_07ED
FDB2  TXA
FDB3  AND #$3E
FDB5  BEQ bra_FDD2_RTS
FDB7  CMP #$20
FDB9  BEQ bra_FDC3
FDBB  LDA #$00
FDBD  LDX #$00
FDBF  LDY #$08
FDC1  BNE bra_FDC9    ; jmp
bra_FDC3:
FDC3  LDA #$00
FDC5  LDX #$02
FDC7  LDY #$08
bra_FDC9:
FDC9  STA $400C
FDCC  STX $400E
FDCF  STY $400F
bra_FDD2_RTS:
FDD2  RTS
tbl_FDD3:
FDD3  .byte off_FDDB_08 - tbl_FDD3   ; 00 
FDD4  .byte off_FDE1_0E - tbl_FDD3   ; 01 
FDD5  .byte off_FDE7_14 - tbl_FDD3   ; 02 
FDD6  .byte off_FDE1_0E - tbl_FDD3   ; 03 
FDD7  .byte off_FDE1_0E - tbl_FDD3   ; 04 
FDD8  .byte off_FDEC_19 - tbl_FDD3   ; 05 
FDD9  .byte off_FDF1_1E - tbl_FDD3   ; 06 
FDDA  .byte off_FDF6_23 - tbl_FDD3   ; 07 
tbl_FDDB:
off_FDDB_08:
FDDB  .byte $00   ; 
FDDC  .word _off_001_FF64_00
FDDE  .byte $2D   ; 
FDDF  .byte $59   ; 
FDE0  .byte $74   ; 
off_FDE1_0E:
FDE1  .byte $0F   ; 
FDE2  .word _off_001_FDFB_01
FDE4  .byte $31   ; 
FDE5  .byte $56   ; 
FDE6  .byte $7B   ; 
off_FDE7_14:
FDE7  .byte $08   ; 
FDE8  .word _off_001_FE87_02
FDEA  .byte $27   ; 
FDEB  .byte $41   ; 
off_FDEC_19:
FDEC  .byte $0F   ; sharing with 0x003DF7 ?
FDED  .word _off_001_FEF3_05
FDEF  .byte $03   ; 
FDF0  .byte $00   ; 
off_FDF1_1E:
FDF1  .byte $08   ; sharing with 0x003DFC ?
FDF2  .word _off_001_FEFD_06
FDF4  .byte $02   ; 
FDF5  .byte $00   ; 
off_FDF6_23:
FDF6  .byte $08   ; sharing with 0x003E01 ?
FDF7  .word _off_001_FFF0_07
FDF9  .byte $02   ; 
FDFA  .byte $00   ; 
_off_001_FDFB_01:
FDFB  .byte $02   ; sharing with 0x003E06 ?
FDFC  .byte $20   ; 
FDFD  .byte $26   ; 
FDFE  .byte $02   ; 
FDFF  .byte $4A   ; 
FE00  .byte $02   ; 
FE01  .byte $06   ; 
FE02  .byte $02   ; 
FE03  .byte $20   ; 
FE04  .byte $26   ; 
FE05  .byte $02   ; 
FE06  .byte $4A   ; 
FE07  .byte $02   ; 
FE08  .byte $06   ; 
FE09  .byte $02   ; 
FE0A  .byte $20   ; 
FE0B  .byte $26   ; 
FE0C  .byte $02   ; 
FE0D  .byte $2E   ; 
FE0E  .byte $02   ; 
FE0F  .byte $2E   ; 
FE10  .byte $02   ; 
FE11  .byte $2E   ; 
FE12  .byte $46   ; 
FE13  .byte $AE   ; 
FE14  .byte $02   ; 
FE15  .byte $42   ; 
FE16  .byte $6E   ; 
FE17  .byte $6A   ; 
FE18  .byte $22   ; 
FE19  .byte $1C   ; 
FE1A  .byte $2A   ; 
FE1B  .byte $22   ; 
FE1C  .byte $1C   ; 
FE1D  .byte $2A   ; 
FE1E  .byte $6E   ; 
FE1F  .byte $22   ; 
FE20  .byte $1C   ; 
FE21  .byte $2E   ; 
FE22  .byte $22   ; 
FE23  .byte $1C   ; 
FE24  .byte $2E   ; 
FE25  .byte $1C   ; 
FE26  .byte $60   ; 
FE27  .byte $62   ; 
FE28  .byte $64   ; 
FE29  .byte $26   ; 
FE2A  .byte $86   ; 
FE2B  .byte $00   ; 
FE2C  .byte $82   ; 
FE2D  .byte $60   ; 
FE2E  .byte $58   ; 
FE2F  .byte $42   ; 
FE30  .byte $58   ; 
FE31  .byte $60   ; 
FE32  .byte $58   ; 
FE33  .byte $42   ; 
FE34  .byte $58   ; 
FE35  .byte $60   ; 
FE36  .byte $5C   ; 
FE37  .byte $60   ; 
FE38  .byte $5C   ; 
FE39  .byte $60   ; 
FE3A  .byte $5C   ; 
FE3B  .byte $60   ; 
FE3C  .byte $5C   ; 
FE3D  .byte $62   ; 
FE3E  .byte $18   ; 
FE3F  .byte $36   ; 
FE40  .byte $22   ; 
FE41  .byte $18   ; 
FE42  .byte $36   ; 
FE43  .byte $22   ; 
FE44  .byte $66   ; 
FE45  .byte $3A   ; 
FE46  .byte $3A   ; 
FE47  .byte $26   ; 
FE48  .byte $3A   ; 
FE49  .byte $3A   ; 
FE4A  .byte $26   ; 
FE4B  .byte $36   ; 
FE4C  .byte $7A   ; 
FE4D  .byte $58   ; 
FE4E  .byte $5C   ; 
FE4F  .byte $22   ; 
FE50  .byte $A6   ; 
FE51  .byte $82   ; 
FE52  .byte $58   ; 
FE53  .byte $66   ; 
FE54  .byte $58   ; 
FE55  .byte $66   ; 
FE56  .byte $58   ; 
FE57  .byte $66   ; 
FE58  .byte $58   ; 
FE59  .byte $66   ; 
FE5A  .byte $60   ; 
FE5B  .byte $68   ; 
FE5C  .byte $60   ; 
FE5D  .byte $68   ; 
FE5E  .byte $60   ; 
FE5F  .byte $68   ; 
FE60  .byte $60   ; 
FE61  .byte $68   ; 
FE62  .byte $46   ; 
FE63  .byte $2A   ; 
FE64  .byte $22   ; 
FE65  .byte $06   ; 
FE66  .byte $2A   ; 
FE67  .byte $22   ; 
FE68  .byte $06   ; 
FE69  .byte $50   ; 
FE6A  .byte $26   ; 
FE6B  .byte $26   ; 
FE6C  .byte $10   ; 
FE6D  .byte $10   ; 
FE6E  .byte $26   ; 
FE6F  .byte $26   ; 
FE70  .byte $22   ; 
FE71  .byte $66   ; 
FE72  .byte $6A   ; 
FE73  .byte $6A   ; 
FE74  .byte $0A   ; 
FE75  .byte $8E   ; 
FE76  .byte $41   ; 
FE77  .byte $A0   ; 
FE78  .byte $A0   ; 
FE79  .byte $A0   ; 
FE7A  .byte $A0   ; 
FE7B  .byte $A0   ; 
FE7C  .byte $A0   ; 
FE7D  .byte $A0   ; 
FE7E  .byte $60   ; 
FE7F  .byte $E0   ; 
FE80  .byte $E0   ; 
FE81  .byte $20   ; 
FE82  .byte $60   ; 
FE83  .byte $60   ; 
FE84  .byte $60   ; 
FE85  .byte $20   ; 
FE86  .byte $A0   ; 
_off_001_FE87_02:
FE87  .byte $22   ; 
FE88  .byte $26   ; 
FE89  .byte $22   ; 
FE8A  .byte $26   ; 
FE8B  .byte $22   ; 
FE8C  .byte $26   ; 
FE8D  .byte $26   ; 
FE8E  .byte $2A   ; 
FE8F  .byte $26   ; 
FE90  .byte $2A   ; 
FE91  .byte $26   ; 
FE92  .byte $2A   ; 
FE93  .byte $2A   ; 
FE94  .byte $2C   ; 
FE95  .byte $2A   ; 
FE96  .byte $2C   ; 
FE97  .byte $2A   ; 
FE98  .byte $2C   ; 
FE99  .byte $46   ; 
FE9A  .byte $6E   ; 
FE9B  .byte $66   ; 
FE9C  .byte $6B   ; 
FE9D  .byte $6F   ; 
FE9E  .byte $46   ; 
FE9F  .byte $4A   ; 
FEA0  .byte $4E   ; 
FEA1  .byte $47   ; 
FEA2  .byte $6E   ; 
FEA3  .byte $46   ; 
FEA4  .byte $4A   ; 
FEA5  .byte $6D   ; 
FEA6  .byte $67   ; 
FEA7  .byte $62   ; 
FEA8  .byte $62   ; 
FEA9  .byte $62   ; 
FEAA  .byte $67   ; 
FEAB  .byte $67   ; 
FEAC  .byte $6B   ; 
FEAD  .byte $00   ; 
FEAE  .byte $6D   ; 
FEAF  .byte $47   ; 
FEB0  .byte $4B   ; 
FEB1  .byte $50   ; 
FEB2  .byte $4E   ; 
FEB3  .byte $46   ; 
FEB4  .byte $4B   ; 
FEB5  .byte $55   ; 
FEB6  .byte $50   ; 
FEB7  .byte $54   ; 
FEB8  .byte $56   ; 
FEB9  .byte $51   ; 
FEBA  .byte $4E   ; 
FEBB  .byte $50   ; 
FEBC  .byte $54   ; 
FEBD  .byte $4B   ; 
FEBE  .byte $4F   ; 
FEBF  .byte $34   ; 
FEC0  .byte $18   ; 
FEC1  .byte $34   ; 
FEC2  .byte $18   ; 
FEC3  .byte $34   ; 
FEC4  .byte $18   ; 
FEC5  .byte $59   ; 
FEC6  .byte $59   ; 
FEC7  .byte $5D   ; 
FEC8  .byte $66   ; 
FEC9  .byte $6A   ; 
FECA  .byte $6C   ; 
FECB  .byte $66   ; 
FECC  .byte $6A   ; 
FECD  .byte $6C   ; 
FECE  .byte $66   ; 
FECF  .byte $6A   ; 
FED0  .byte $6C   ; 
FED1  .byte $66   ; 
FED2  .byte $6A   ; 
FED3  .byte $6C   ; 
FED4  .byte $66   ; 
FED5  .byte $6A   ; 
FED6  .byte $6C   ; 
FED7  .byte $66   ; 
FED8  .byte $6A   ; 
FED9  .byte $6C   ; 
FEDA  .byte $66   ; 
FEDB  .byte $6A   ; 
FEDC  .byte $6C   ; 
FEDD  .byte $66   ; 
FEDE  .byte $6A   ; 
FEDF  .byte $6C   ; 
FEE0  .byte $66   ; 
FEE1  .byte $6A   ; 
FEE2  .byte $6C   ; 
FEE3  .byte $66   ; 
FEE4  .byte $6A   ; 
FEE5  .byte $6C   ; 
FEE6  .byte $67   ; 
FEE7  .byte $6C   ; 
FEE8  .byte $6C   ; 
FEE9  .byte $6C   ; 
FEEA  .byte $66   ; 
FEEB  .byte $66   ; 
FEEC  .byte $66   ; 
FEED  .byte $66   ; 
FEEE  .byte $66   ; 
FEEF  .byte $66   ; 
FEF0  .byte $6A   ; 
FEF1  .byte $6A   ; 
FEF2  .byte $6A   ; 
_off_001_FEF3_05:
FEF3  .byte $03   ; 
FEF4  .byte $03   ; 
FEF5  .byte $00   ; 
FEF6  .byte $76   ; 
FEF7  .byte $82   ; 
FEF8  .byte $76   ; 
FEF9  .byte $82   ; 
FEFA  .byte $76   ; 
FEFB  .byte $82   ; 
FEFC  .byte $2B   ; 
_off_001_FEFD_06:
FEFD  .byte $42   ; 
FEFE  .byte $00   ; 
FEFF  .byte $44   ; 
tbl_FF00:
FF00  .byte $06, $AE   ; 
FF02  .byte $00, $00   ; 
FF04  .byte $00, $69   ; 
FF06  .byte $00, $D4   ; 
FF08  .byte $00, $C8   ; 
FF0A  .byte $00, $BD   ; 
FF0C  .byte $00, $B2   ; 
FF0E  .byte $00, $A8   ; 
FF10  .byte $00, $9F   ; 
FF12  .byte $00, $96   ; 
FF14  .byte $00, $8D   ; 
FF16  .byte $00, $7E   ; 
FF18  .byte $01, $AB   ; 
FF1A  .byte $01, $93   ; 
FF1C  .byte $01, $7C   ; 
FF1E  .byte $01, $67   ; 
FF20  .byte $01, $52   ; 
FF22  .byte $01, $3F   ; 
FF24  .byte $01, $2D   ; 
FF26  .byte $01, $1C   ; 
FF28  .byte $01, $0C   ; 
FF2A  .byte $00, $FD   ; 
FF2C  .byte $00, $EE   ; 
FF2E  .byte $00, $E1   ; 
FF30  .byte $03, $57   ; 
FF32  .byte $02, $3A   ; 
FF34  .byte $02, $1A   ; 
FF36  .byte $01, $FC   ; 
FF38  .byte $01, $DF   ; 
FF3A  .byte $01, $C4   ; 
FF3C  .byte $07, $FA   ; 
tbl_FF3E:
FF3E  .byte $04   ; 
FF3F  .byte $08   ; 
FF40  .byte $10   ; 
FF41  .byte $20   ; 
FF42  .byte $05   ; 
FF43  .byte $18   ; 
FF44  .byte $0A   ; 
FF45  .byte $06   ; 
FF46  .byte $05   ; 
FF47  .byte $0A   ; 
FF48  .byte $14   ; 
FF49  .byte $28   ; 
FF4A  .byte $50   ; 
FF4B  .byte $1E   ; 
FF4C  .byte $3C   ; 
FF4D  .byte $07   ; 
FF4E  .byte $0E   ; 
FF4F  .byte $1C   ; 
FF50  .byte $38   ; 
FF51  .byte $70   ; 
FF52  .byte $2A   ; 
sub_FF53:
FF53  TAX
FF54  ROR
FF55  TXA
FF56  ROL
FF57  ROL
FF58  ROL
FF59  AND #$07
FF5B  CLC
FF5C  ADC ram_07F0
FF5F  TAY
FF60  LDA tbl_FF3E,Y
FF63  RTS
_off_001_FF64_00:
FF64  .byte $82   ; 
FF65  .byte $60   ; 
FF66  .byte $42   ; 
FF67  .byte $66   ; 
FF68  .byte $42   ; 
FF69  .byte $46   ; 
FF6A  .byte $42   ; 
FF6B  .byte $60   ; 
FF6C  .byte $66   ; 
FF6D  .byte $42   ; 
FF6E  .byte $47   ; 
FF6F  .byte $C2   ; 
FF70  .byte $68   ; 
FF71  .byte $42   ; 
FF72  .byte $6E   ; 
FF73  .byte $42   ; 
FF74  .byte $4E   ; 
FF75  .byte $42   ; 
FF76  .byte $68   ; 
FF77  .byte $6E   ; 
FF78  .byte $42   ; 
FF79  .byte $4F   ; 
FF7A  .byte $C2   ; 
FF7B  .byte $0B   ; 
FF7C  .byte $03   ; 
FF7D  .byte $C7   ; 
FF7E  .byte $0B   ; 
FF7F  .byte $03   ; 
FF80  .byte $C7   ; 
FF81  .byte $2B   ; 
FF82  .byte $03   ; 
FF83  .byte $E7   ; 
FF84  .byte $A2   ; 
FF85  .byte $23   ; 
FF86  .byte $03   ; 
FF87  .byte $E1   ; 
FF88  .byte $5E   ; 
FF89  .byte $5D   ; 
FF8A  .byte $58   ; 
FF8B  .byte $A0   ; 
FF8C  .byte $A2   ; 
FF8D  .byte $A4   ; 
FF8E  .byte $66   ; 
FF8F  .byte $C6   ; 
FF90  .byte $00   ; 
FF91  .byte $82   ; 
FF92  .byte $58   ; 
FF93  .byte $42   ; 
FF94  .byte $60   ; 
FF95  .byte $42   ; 
FF96  .byte $66   ; 
FF97  .byte $42   ; 
FF98  .byte $58   ; 
FF99  .byte $60   ; 
FF9A  .byte $42   ; 
FF9B  .byte $67   ; 
FF9C  .byte $C2   ; 
FF9D  .byte $60   ; 
FF9E  .byte $42   ; 
FF9F  .byte $68   ; 
FFA0  .byte $42   ; 
FFA1  .byte $6E   ; 
FFA2  .byte $42   ; 
FFA3  .byte $60   ; 
FFA4  .byte $68   ; 
FFA5  .byte $42   ; 
FFA6  .byte $6F   ; 
FFA7  .byte $C2   ; 
FFA8  .byte $2B   ; 
FFA9  .byte $03   ; 
FFAA  .byte $EB   ; 
FFAB  .byte $2B   ; 
FFAC  .byte $03   ; 
FFAD  .byte $EB   ; 
FFAE  .byte $23   ; 
FFAF  .byte $03   ; 
FFB0  .byte $E3   ; 
FFB1  .byte $9C   ; 
FFB2  .byte $1D   ; 
FFB3  .byte $03   ; 
FFB4  .byte $D9   ; 
FFB5  .byte $78   ; 
FFB6  .byte $7B   ; 
FFB7  .byte $72   ; 
FFB8  .byte $98   ; 
FFB9  .byte $98   ; 
FFBA  .byte $9C   ; 
FFBB  .byte $62   ; 
FFBC  .byte $E0   ; 
FFBD  .byte $98   ; 
FFBE  .byte $A6   ; 
FFBF  .byte $98   ; 
FFC0  .byte $A6   ; 
FFC1  .byte $98   ; 
FFC2  .byte $A6   ; 
FFC3  .byte $98   ; 
FFC4  .byte $A6   ; 
FFC5  .byte $A0   ; 
FFC6  .byte $AE   ; 
FFC7  .byte $A0   ; 
FFC8  .byte $AE   ; 
FFC9  .byte $A0   ; 
FFCA  .byte $AE   ; 
FFCB  .byte $A0   ; 
FFCC  .byte $AE   ; 
FFCD  .byte $9C   ; 
FFCE  .byte $EA   ; 
FFCF  .byte $9C   ; 
FFD0  .byte $E6   ; 
FFD1  .byte $E2   ; 
FFD2  .byte $60   ; 
FFD3  .byte $A6   ; 
FFD4  .byte $AA   ; 
FFD5  .byte $AA   ; 
FFD6  .byte $4A   ; 
FFD7  .byte $E6   ; 
FFD8  .byte $80   ; 
FFD9  .byte $E0   ; 
FFDA  .byte $E0   ; 
FFDB  .byte $E0   ; 
FFDC  .byte $E0   ; 
FFDD  .byte $E0   ; 
FFDE  .byte $E0   ; 
FFDF  .byte $E0   ; 
FFE0  .byte $A0   ; 
FFE1  .byte $A0   ; 
FFE2  .byte $C0   ; 
FFE3  .byte $A0   ; 
FFE4  .byte $E0   ; 
FFE5  .byte $50   ; 
FFE6  .byte $E0   ; 
FFE7  .byte $A0   ; 
FFE8  .byte $A0   ; 
FFE9  .byte $A0   ; 
FFEA  .byte $60   ; 
FFEB  .byte $10   ; 
FFEC  .byte $10   ; 
FFED  .byte $10   ; 
FFEE  .byte $10   ; 
FFEF  .byte $A0   ; 
vec_FFF0_IRQ:
_off_001_FFF0_07:
FFF0  .byte $83   ; 
FFF1  .byte $00   ; 
FFF2  .byte $04   ; 
FFF3  .byte $14   ; 
FFF4  .byte $04   ; 
FFF5  .byte $14   ; 
FFF6  .byte $04   ; 
FFF7  .byte $14   ; 
FFF8  .byte $04   ; 
FFF9  .byte $D4   ; 
.out .sprintf("Free bytes in bank FF: %Xh [%d]", ($FFFA - *), ($FFFA - *))
.segment "VECTORS"
FFFA  .word vec_C23B_NMI
FFFC  .word vec_C184_RESET
FFFE  .word vec_FFF0_IRQ
