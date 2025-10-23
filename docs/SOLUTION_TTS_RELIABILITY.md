# TTS Reliability Solution Options

## Current Issue
Chrome's browser TTS (`speechSynthesis`) can fail due to:
- Voice loading timing
- Tab suspension
- Audio pipeline issues
- Memory management

## Recommended Solution: Hybrid Approach

### Phase 1: Enhanced Browser TTS (Current)
✅ Already implemented:
- Voice loading wait logic
- Voice selection by language
- Context-aware settings

🔧 Additional improvements needed:
- Resume on tab focus
- Retry logic on failure
- Visual feedback when audio fails

### Phase 2: Pre-recorded Critical Audio
Record and cache essential phrases:
- Challenge feedback: "Correct!", "Try again!", etc.
- Completion messages
- Hint instructions

**Storage:** ~5-10 audio files × 3 languages = ~5MB

### Phase 3: Cloud TTS Fallback (Optional)
If budget allows, add Google Cloud TTS for:
- Story sentences (dynamic content)
- User-generated content
- High-quality voices

## Implementation Priority

### Immediate (Do Now):
1. Add retry logic to speech utility
2. Add visual feedback (speaker icon animation)
3. Test across browsers

### Short-term (Next Sprint):
1. Record top 20 most-used phrases
2. Implement audio file playback
3. Add hybrid fallback logic

### Long-term (If Needed):
1. Set up Google Cloud TTS
2. Create backend API endpoint
3. Cache responses in IndexedDB

## Cost Analysis

| Solution | Setup Time | Ongoing Cost | Reliability |
|----------|-----------|--------------|-------------|
| Browser TTS | 0 hrs | $0 | 70-80% |
| Enhanced TTS | 4 hrs | $0 | 85-90% |
| Pre-recorded | 8 hrs | $0 | 95% |
| Cloud TTS | 16 hrs | $20-50/mo | 99% |
| Hybrid | 12 hrs | $10-20/mo | 98% |

## Recommendation for Pangolin Proto

**Start with: Enhanced Browser TTS + Pre-recorded Critical Audio**

This gives you:
- ✅ 95%+ reliability
- ✅ Zero ongoing costs
- ✅ Works offline
- ✅ Professional quality for key moments
- ✅ Reasonable implementation time (12 hours)

Move to Cloud TTS only if:
- You get significant funding
- You need dynamic multilingual support at scale
- You expand to many more languages
