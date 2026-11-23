<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->
	<xsl:template match="/Parameters/param[@id='269848']">
		<xsl:copy-of select="."/>
		<xsl:choose>
			<xsl:when test="/Parameters/param[@id='269849']"/>
			<xsl:otherwise>
				<param id="269849">
					<name>CALIBRATED TRACK DIAMETER</name>
					<short_name>TRACK DIAMETER</short_name>
					<desc>The calculated track diamter using the axis' encoder counts.</desc>
				</param>
				<param id="269850">
					<name>OLD CALIBRATED TRACK DIAMETER</name>
					<short_name>TRACK DIAMETER</short_name>
					<desc>The calculated old track diamter using the axis' encoder counts.</desc>
				</param>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>