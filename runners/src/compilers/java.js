const compile = async (folder, source, execHook) => {
	const compileResult = await execHook(`javac *.java`, { cwd: folder })
	return {error: compileResult.err && compileResult.err.toString(), stdout: compileResult.stdout.toString(), stderr: compileResult.stderr.toString()}
}

const run = async (folder, source, execHook, input = null, timeout = 2500) => {
	const runnerResult = await execHook(`/usr/bin/time -f "%M %e" java ${source[0].name.replace(".java", "")}`, { timeout, cwd: folder }, input) 
	return {error: runnerResult.err && runnerResult.err.toString(), stdout: runnerResult.stdout.toString(), stderr: runnerResult.stderr.toString()}
}

module.exports = {compile, run}

