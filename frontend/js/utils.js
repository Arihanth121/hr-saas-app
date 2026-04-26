
export function computeStats(entries){
  const map = new Map();
  for(const e of entries){
    if(!map.has(e.userId)){
      map.set(e.userId,{total:0, success:0});
    }
    const obj = map.get(e.userId);
    obj.total++;
    if(e.status === "Selected" || e.status === "Joined"){
      obj.success++;
    }
  }
  return Array.from(map.entries()).map(([userId,val])=>({
    userId,
    total: val.total,
    successRate: Math.round((val.success/val.total)*100 || 0)
  }));
}
