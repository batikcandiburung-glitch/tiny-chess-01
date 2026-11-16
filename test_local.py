import time
import main

FILES = 'abcdefgh'

def get_legal_moves(fen):
    b, w, c, ep = main.P(fen)
    moves = main.G(b, w, c, ep)
    legal = []
    for m in moves:
        fr, to, pr = m
        nb, nw, nc, nep = main.M(b, w, c, ep, m)
        ks = next((sq for sq, p in enumerate(nb) if p == ('K' if w else 'k')), -1)
        if ks != -1 and not main.A(nb, ks, nw):
            legal.append(FILES[fr & 7] + str((fr >> 3) + 1) + FILES[to & 7] + str((to >> 3) + 1) + pr)
    return legal

def test_engine():
    start_fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
    
    start_legal = get_legal_moves(start_fen)
    t0 = time.time()
    move = main.choose(start_fen, start_legal)
    dt = time.time() - t0
    print(f"(a) Start position chosen move: {move} (took {dt:.4f}s)")
    assert move in start_legal, f"Move {move} not legal!"
    print("Assertion (a) passed!")

    fen = start_fen
    times = []
    b, w, c, ep = main.P(fen)
    
    for half_move in range(40):
        legal = get_legal_moves(fen)
        if not legal:
            print(f"No legal moves at half-move {half_move}. Game over.")
            break
        t0 = time.time()
        m_str = main.choose(fen, legal)
        dt = time.time() - t0
        times.append(dt)
        
        assert m_str in legal, f"Self-play move {m_str} illegal at half-move {half_move}!"
        print(f"Half-move {half_move + 1}: {m_str} (took {dt:.4f}s)")
        
        fr = ord(m_str[0])-97 + 8*(int(m_str[1])-1)
        to = ord(m_str[2])-97 + 8*(int(m_str[3])-1)
        pr = m_str[4] if len(m_str) == 5 else ''
        b, w, c, ep = main.P(fen)
        nb, nw, nc, nep = main.M(b, w, c, ep, (fr, to, pr))
        
        rows = []
        for r in range(7, -1, -1):
            row_str = ""
            empty = 0
            for col in range(8):
                p = nb[r * 8 + col]
                if p == '.':
                    empty += 1
                else:
                    if empty:
                        row_str += str(empty)
                        empty = 0
                    row_str += p
            if empty:
                row_str += str(empty)
            rows.append(row_str)
        piece_str = "/".join(rows)
        turn_str = 'w' if nw else 'b'
        ep_str = '-' if nep == -1 else (FILES[nep & 7] + str((nep >> 3) + 1))
        halfmove_clock = 0
        fullmove_number = 1 + (half_move // 2) if not nw else 1 + ((half_move + 1) // 2)
        fen = f"{piece_str} {turn_str} {nc} {ep_str} {halfmove_clock} {fullmove_number}"

    if times:
        avg_time = sum(times) / len(times)
        print(f"(c) Average seconds per move over {len(times)} moves: {avg_time:.4f}s")

if __name__ == "__main__":
    test_engine()
