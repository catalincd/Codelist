const compile = async (folder, source, execHook) => {
	return {error: null}
}

const run = async (folder, source, execHook, input = null, timeout = 2500) => {
	const runnerResult = await execHook(`/usr/bin/time -f "%M %e" node ${source[0].name}`, { timeout, cwd: folder }, input) 
	return {error: runnerResult.err && runnerResult.err.toString(), stdout: runnerResult.stdout.toString(), stderr: runnerResult.stderr.toString()}
}

module.exports = {compile, run}

