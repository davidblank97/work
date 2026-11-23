<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->

	<xsl:template match="/language/text[@id='525']">
		<xsl:copy-of select="."/>
		<xsl:choose>
			<xsl:when test="/language/text[@id='526']"/>
			<xsl:otherwise>
				<text id="526">
					<content>TRACK DIAMETER</content>
					<desc>Refers to the calculated value of track diameter.</desc>
				</text>
				<text id="527">
					<content>CALIBRATED</content>
					<desc>N/A.</desc>
				</text>
				<text id="528">
					<content>FLAT TRACK</content>
					<desc>Refers to the flat shape of the track that a robot is attached to.</desc>
				</text>
				<text id="529">
					<content>ROTARY TRACK</content>
					<desc>Refers to the orbital shape of the track that a robot is attached to.</desc>
				</text>
				<text id="530">
					<content>PREPARE THE TRACK</content>
					<desc>A title for a message that propmts the user to prepare the track of a robot for calibration.</desc>
				</text>
				<text id="531">
					<content>CALIBRATE ROTARY TRACK</content>
					<desc>A title for a message that propmts the user to perform an action for calibration of a robot.</desc>
				</text>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	
	<xsl:template match="/language/text[@id='65594']">
		<xsl:copy-of select="."/>
		<xsl:choose>
			<xsl:when test="/language/text[@id='65595']"/>
			<xsl:otherwise>
				<text id="65595">
					<content>There is no need to calibrate a flat track.</content>
					<desc>Description of a step in a welding procedure.</desc>
				</text>
				<text id="65596">
					<content>Mark the current position of the weldhead on the track.</content>
					<desc>Description of a step in a welding procedure. Mark the track where the </desc>
				</text>
				<text id="65597">
					<content>Jog the weldhead until is has completed a full rotation around the track and returned to the previously marked position. Press NEXT once completed.</content>
					<desc>Description of a step in a welding procedure. Rotate the weldhead 360 degrees.</desc>
				</text>
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