<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output indent="no" omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->

	<xsl:template match="/language[@fileType='EXE']">
		<xsl:copy>
			<xsl:apply-templates select="@*|node()"/>
			<str id="17">
				<text>A weld has been started while Trace Logs are enabled. Welding performance may be heavily impacted.</text>
				<desc>The user has started a weld while the system is collecting Trace Log diagnostics data. This can lead to performance issues with the weld.</desc>
			</str>
		</xsl:copy>
	</xsl:template>
	
	<xsl:template match="/language[@fileType='SCH']">
		<xsl:copy>
			<xsl:apply-templates select="@*|node()"/>
			<str id="47">
				<text>The calculated average heat input telemetry [%1] went outside of the acceptable range of %2 to %3 for segment number %4. To view and adjust the acceptable ranges, use the LIMITS screen.</text>
				<desc>%1 =  parameter telemetry. %2 = fault threshold lower limit. %3 =  fault threshold upper limit. %4 = segment index</desc>
			</str>
		</xsl:copy>
	</xsl:template>
	
	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>