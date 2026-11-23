<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->
	<xsl:template match="/sched/overrides/amp_rate"/>
		
	<xsl:template match="/sched/overrides/amp_max">
		<pri_amp_max><xsl:value-of select="/sched/overrides/amp_max"/></pri_amp_max>
		<pri_amp_rate><xsl:value-of select="/sched/overrides/amp_rate"/></pri_amp_rate>
		<bkg_amp_max><xsl:value-of select="/sched/overrides/amp_max"/></bkg_amp_max>
		<bkg_amp_rate><xsl:value-of select="/sched/overrides/amp_rate"/></bkg_amp_rate>
	</xsl:template>
	
	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>