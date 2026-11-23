<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->

	<!-- insert id 47 if it does not exist -->
	<xsl:template match="/language[@fileType='SCH']/str[@id='46']">
		<xsl:copy-of select="."/>
		<xsl:choose>
			<xsl:when test="/language[@fileType='SCH']/str[@id='47']"/>
			<xsl:otherwise>
				<str id="47">
					<text>The calculated average heat input telemetry [%1] went outside of the acceptable range of %2 to %3 for segment number %4. To view and adjust the acceptable ranges, use the LIMITS screen.</text>
					<desc>%1 =  parameter telemetry. %2 = fault threshold lower limit. %3 =  fault threshold upper limit. %4 = segment index</desc>
				</str>
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